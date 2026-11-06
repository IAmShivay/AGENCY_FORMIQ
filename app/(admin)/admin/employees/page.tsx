'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Building,
  Eye,
  Users as UsersIcon,
  Award,
  Paperclip,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import Modal, { ConfirmModal } from '@/components/Modal';
import AttachmentViewer, { FileUploadPreview } from '@/components/AttachmentViewer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_ROW,
  ADMIN_STAT_VALUE,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

interface Employee {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  position: string;
  phone: string;
  address: string;
  date_of_birth: string;
  hire_date: string;
  salary: number;
  employee_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  skills: string[];
  bio: string;
  profile_image_url: string;
  is_admin: boolean;
  is_active: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
    uploaded_at: string;
  }>;
  created_at: string;
}

interface EmployeeDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

interface BankDetails {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  routing_number: string;
  swift_code: string;
  bank_address: string;
  account_type: string;
  is_primary: boolean;
}

const ROLE_TONE: Record<string, AdminTone> = {
  admin: 'accent',
  manager: 'warning',
  sales: 'positive',
  developer: 'neutral',
  designer: 'neutral',
  marketing: 'neutral',
  employee: 'neutral',
};

const ACTIVE_TONE: Record<'active' | 'inactive', AdminTone> = {
  active: 'positive',
  inactive: 'negative',
};

const FIELD_LABEL = `${ADMIN_LABEL} mb-2 block`;
const FILE_INPUT = `${ADMIN_INPUT} h-auto py-2 file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:text-foreground`;
const SECTION_TITLE = 'mb-4 text-lg font-semibold text-foreground';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'documents' | 'bank'>('basic');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: '',
    position: '',
    address: '',
    date_of_birth: '',
    hire_date: '',
    salary: '',
    employee_id: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    skills: '',
    bio: '',
    is_admin: false
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (employeeId: string) => {
    if (attachments.length === 0) return [];

    const uploadedAttachments = [];

    for (const file of attachments) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `employees/${employeeId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('formiqstudio')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('formiqstudio')
          .getPublicUrl(fileName);

        uploadedAttachments.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    return uploadedAttachments;
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employeeData = {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role || 'employee',
        department: formData.department || null,
        position: formData.position || null,
        phone: formData.phone || null,
        address: formData.address || null,
        date_of_birth: formData.date_of_birth || null,
        hire_date: formData.hire_date || null,
        salary: formData.salary && formData.salary.trim() !== '' ? parseFloat(formData.salary) : null,
        employee_id: formData.employee_id || null,
        emergency_contact_name: formData.emergency_contact_name || null,
        emergency_contact_phone: formData.emergency_contact_phone || null,
        skills: formData.skills && formData.skills.trim() !== '' ? formData.skills.split(',').map(s => s.trim()) : [],
        bio: formData.bio || null,
        is_admin: formData.is_admin,
        is_active: true
      };

      if (selectedEmployee) {
        const uploadedAttachments = await uploadAttachments(selectedEmployee.id);

        const existingAttachments = selectedEmployee.attachments || [];
        const allAttachments = [...existingAttachments, ...uploadedAttachments];

        const { error } = await supabase
          .from('users')
          .update({ ...employeeData, attachments: allAttachments })
          .eq('id', selectedEmployee.id);

        if (error) throw error;
        toast.success('Employee updated successfully!');
      } else {
        const { data: newEmployee, error: employeeError } = await supabase
          .from('users')
          .insert([employeeData])
          .select()
          .single();

        if (employeeError) throw employeeError;

        const uploadedAttachments = await uploadAttachments(newEmployee.id);

        if (uploadedAttachments.length > 0) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ attachments: uploadedAttachments })
            .eq('id', newEmployee.id);

          if (updateError) throw updateError;
        }

        toast.success('Employee added successfully!');
      }

      setShowAddModal(false);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Failed to add employee. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'employee',
      department: '',
      position: '',
      address: '',
      date_of_birth: '',
      hire_date: '',
      salary: '',
      employee_id: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      skills: '',
      bio: '',
      is_admin: false
    });
    setSelectedEmployee(null);
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditEmployee = (employee: Employee) => {
    setFormData({
      full_name: employee.full_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      role: employee.role || 'employee',
      department: employee.department || '',
      position: employee.position || '',
      address: employee.address || '',
      date_of_birth: employee.date_of_birth || '',
      hire_date: employee.hire_date || '',
      salary: employee.salary ? employee.salary.toString() : '',
      employee_id: employee.employee_id || '',
      emergency_contact_name: employee.emergency_contact_name || '',
      emergency_contact_phone: employee.emergency_contact_phone || '',
      skills: employee.skills ? employee.skills.join(', ') : '',
      bio: employee.bio || '',
      is_admin: employee.is_admin || false
    });
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', employeeId);

      if (error) throw error;

      fetchEmployees();
      toast.success('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const confirmDeleteEmployee = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteConfirm(true);
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployeeDetails(employee);
    setShowDetailsModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getRoleBadge = (role: string) =>
    `${ADMIN_BADGE} ${ADMIN_TONE[ROLE_TONE[role] || ROLE_TONE.employee]}`;

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
  const roles = Array.from(new Set(employees.map(e => e.role).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Team"
        title="Employees"
        description="Manage employee details, roles and documents."
        actions={
          <button onClick={() => setShowAddModal(true)} className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            Add employee
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className={`${ADMIN_INPUT} sm:w-48`}
          >
            <option value="all">All departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`${ADMIN_INPUT} sm:w-40`}
          >
            <option value="all">All roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total employees',
            value: employees.length,
            icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'Active employees',
            value: employees.filter(e => e.is_active).length,
            icon: <User className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'Departments',
            value: departments.length,
            icon: <Building className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'Admins',
            value: employees.filter(e => e.is_admin).length,
            icon: <Award className="h-4 w-4 text-muted-foreground" />
          }
        ].map((stat, index) => (
          <div key={index} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <div className="flex items-center justify-between gap-3">
              <p className={ADMIN_EYEBROW}>{stat.label}</p>
              {stat.icon}
            </div>
            <p className={`mt-4 ${ADMIN_STAT_VALUE}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={ADMIN_TABLE_WRAP}>
        <table className={ADMIN_TABLE}>
          <thead>
            <tr>
              <th className={ADMIN_TH}>Employee</th>
              <th className={ADMIN_TH}>Contact</th>
              <th className={ADMIN_TH}>Role</th>
              <th className={ADMIN_TH}>Department</th>
              <th className={ADMIN_TH}>Hire date</th>
              <th className={ADMIN_TH}>Status</th>
              <th className={`${ADMIN_TH} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className={ADMIN_ROW}>
                <td className={ADMIN_TD}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground">
                      {(employee.full_name || employee.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="whitespace-nowrap font-medium text-foreground">
                        {employee.full_name || 'No name'}
                      </div>
                      <div className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                        ID: {employee.employee_id || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={ADMIN_TD}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 whitespace-nowrap text-foreground">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className={ADMIN_TD}>
                  <span className={getRoleBadge(employee.role)}>
                    {employee.role || 'employee'}
                  </span>
                </td>
                <td className={ADMIN_TD}>
                  <div className="whitespace-nowrap text-foreground">
                    {employee.department || 'Not assigned'}
                  </div>
                  {employee.position && (
                    <div className="whitespace-nowrap text-muted-foreground">
                      {employee.position}
                    </div>
                  )}
                </td>
                <td className={`${ADMIN_TD} whitespace-nowrap`}>
                  {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}
                </td>
                <td className={ADMIN_TD}>
                  <span className={`${ADMIN_BADGE} ${ADMIN_TONE[ACTIVE_TONE[employee.is_active ? 'active' : 'inactive']]}`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className={`${ADMIN_TD} text-right`}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleViewDetails(employee)}
                      className={ADMIN_ICON_BTN}
                      title="View details"
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className={ADMIN_ICON_BTN}
                      title="Edit employee"
                      aria-label="Edit employee"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDeleteEmployee(employee.id)}
                      className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}
                      title="Delete employee"
                      aria-label="Delete employee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className={`${ADMIN_EMPTY} border-t border-border`}>
            <UsersIcon className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
            <p className="font-medium text-foreground">No employees found</p>
            <p className="mt-1">Get started by adding your first employee.</p>
            <button onClick={() => setShowAddModal(true)} className={`mt-6 ${ADMIN_BTN_PRIMARY}`}>
              <Plus className="h-4 w-4" />
              Add employee
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
          <div className={`${ADMIN_CARD} max-h-[90vh] w-full max-w-4xl overflow-y-auto`}>
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className={ADMIN_H2}>
                {selectedEmployee ? 'Edit employee' : 'Add new employee'}
              </h2>
            </div>
            <form onSubmit={handleAddEmployee} className={`${ADMIN_CARD_PAD} space-y-8`}>
              <div>
                <h3 className={SECTION_TITLE}>Basic information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL}>Full name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className={ADMIN_INPUT}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={ADMIN_INPUT}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Employee ID</label>
                    <input
                      type="text"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                      placeholder="Enter employee ID"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className={SECTION_TITLE}>Work information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL}>Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className={ADMIN_INPUT}
                    >
                      <option value="employee">Employee</option>
                      <option value="sales">Sales</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="marketing">Marketing</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Hire date</label>
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>Salary</label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={ADMIN_INPUT}
                      placeholder="Enter salary"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 md:pt-6">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-input accent-foreground"
                    />
                    <label className="text-sm font-medium text-foreground">
                      Admin access
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`${SECTION_TITLE} flex items-center gap-2`}>
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  Attachments
                </h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className={FILE_INPUT}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <FileUploadPreview files={attachments} onRemove={removeAttachment} />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className={ADMIN_BTN_GHOST}
                >
                  Cancel
                </button>
                <button type="submit" className={ADMIN_BTN_PRIMARY}>
                  {selectedEmployee ? 'Update employee' : 'Add employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => employeeToDelete && handleDeleteEmployee(employeeToDelete)}
        title="Delete employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Employee details - ${selectedEmployeeDetails?.full_name || 'Unknown'}`}
        size="xl"
      >
        <div className={`${ADMIN_CARD_PAD} space-y-8`}>
          {selectedEmployeeDetails && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
                  <h3 className={SECTION_TITLE}>Personal information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className={ADMIN_LABEL}>Full name</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.full_name || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Email</dt>
                      <dd className="mt-1 break-all text-foreground">{selectedEmployeeDetails.email}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Phone</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.phone || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Address</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.address || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Date of birth</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.date_of_birth || 'Not provided'}</dd>
                    </div>
                  </dl>
                </div>

                <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
                  <h3 className={SECTION_TITLE}>Work information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className={ADMIN_LABEL}>Role</dt>
                      <dd className="mt-1 capitalize text-foreground">{selectedEmployeeDetails.role}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Department</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.department || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Position</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.position || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Employee ID</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.employee_id || 'Not assigned'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Hire date</dt>
                      <dd className="mt-1 text-foreground">{selectedEmployeeDetails.hire_date || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Salary</dt>
                      <dd className="mt-1 tabular-nums text-foreground">
                        {selectedEmployeeDetails.salary ? `$${selectedEmployeeDetails.salary.toLocaleString()}` : 'Not specified'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {selectedEmployeeDetails.skills && selectedEmployeeDetails.skills.length > 0 && (
                <div>
                  <h3 className={SECTION_TITLE}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployeeDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`${ADMIN_BADGE} ${ADMIN_TONE.neutral}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEmployeeDetails.bio && (
                <div>
                  <h3 className={SECTION_TITLE}>Bio</h3>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="whitespace-pre-wrap text-foreground">{selectedEmployeeDetails.bio}</p>
                  </div>
                </div>
              )}

              {(selectedEmployeeDetails.emergency_contact_name || selectedEmployeeDetails.emergency_contact_phone) && (
                <div>
                  <h3 className={SECTION_TITLE}>Emergency contact</h3>
                  <dl className="space-y-4">
                    {selectedEmployeeDetails.emergency_contact_name && (
                      <div>
                        <dt className={ADMIN_LABEL}>Name</dt>
                        <dd className="mt-1 text-foreground">{selectedEmployeeDetails.emergency_contact_name}</dd>
                      </div>
                    )}
                    {selectedEmployeeDetails.emergency_contact_phone && (
                      <div>
                        <dt className={ADMIN_LABEL}>Phone</dt>
                        <dd className="mt-1 text-foreground">{selectedEmployeeDetails.emergency_contact_phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {selectedEmployeeDetails.attachments && selectedEmployeeDetails.attachments.length > 0 && (
                <AttachmentViewer
                  attachments={selectedEmployeeDetails.attachments}
                  title="Employee documents"
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
