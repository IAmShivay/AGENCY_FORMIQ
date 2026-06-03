'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Upload,
  Download,
  Eye,
  MapPin,
  Briefcase,
  Users as UsersIcon,
  Award,
  CreditCard,
  Paperclip,
  X
, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import Modal, { ConfirmModal } from '@/components/Modal';
import AttachmentViewer, { FileUploadPreview } from '@/components/AttachmentViewer';

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
      // Use EXACT same pattern as working portfolio requests
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

        // Get public URL
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
        // Upload new attachments if any
        const uploadedAttachments = await uploadAttachments(selectedEmployee.id);

        // Merge with existing attachments
        const existingAttachments = selectedEmployee.attachments || [];
        const allAttachments = [...existingAttachments, ...uploadedAttachments];

        // Update existing employee
        const { error } = await supabase
          .from('users')
          .update({ ...employeeData, attachments: allAttachments })
          .eq('id', selectedEmployee.id);

        if (error) throw error;
        toast.success('Employee updated successfully!');
      } else {
        // Create new employee first
        const { data: newEmployee, error: employeeError } = await supabase
          .from('users')
          .insert([employeeData])
          .select()
          .single();

        if (employeeError) throw employeeError;

        // Upload attachments for new employee
        const uploadedAttachments = await uploadAttachments(newEmployee.id);

        if (uploadedAttachments.length > 0) {
          // Update employee with attachments
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

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      manager: 'bg-purple-100 text-purple-800 border-purple-200',
      sales: 'bg-green-100 text-green-800 border-green-200',
      developer: 'bg-primary/10 text-primary border-primary/20',
      designer: 'bg-pink-100 text-pink-800 border-pink-200',
      marketing: 'bg-orange-100 text-orange-800 border-orange-200',
      employee: 'bg-secondary text-foreground border-border'
    };
    return colors[role as keyof typeof colors] || colors.employee;
  };

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
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage employee details, documents, and bank information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Employees', 
            value: employees.length, 
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            icon: <UsersIcon className="w-5 h-5" />
          },
          { 
            label: 'Active Employees', 
            value: employees.filter(e => e.is_active).length, 
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            icon: <User className="w-5 h-5" />
          },
          { 
            label: 'Departments', 
            value: departments.length, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            icon: <Building className="w-5 h-5" />
          },
          { 
            label: 'Admins', 
            value: employees.filter(e => e.is_admin).length, 
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            icon: <Award className="w-5 h-5" />
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bgColor} p-4 md:p-6 rounded-xl border border-border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-card`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Employees Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Hire Date</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 md:px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {(employee.full_name || employee.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {employee.full_name || 'No Name'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {employee.employee_id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {employee.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(employee.role)}`}>
                      {employee.role?.toUpperCase() || 'EMPLOYEE'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm text-foreground">
                      {employee.department || 'Not Assigned'}
                    </div>
                    {employee.position && (
                      <div className="text-sm text-muted-foreground">
                        {employee.position}
                      </div>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm text-foreground">
                      {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.is_active
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {employee.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        title="Edit Employee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteEmployee(employee.id)}
                        className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first employee</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter employee ID"
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Work Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter position"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter salary"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <label className="ml-2 text-sm font-medium text-foreground">
                      Admin Access
                    </label>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Attachments</h3>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <FileUploadPreview files={attachments} onRemove={removeAttachment} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
                >
                  {selectedEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => employeeToDelete && handleDeleteEmployee(employeeToDelete)}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      {/* Employee Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Employee Details - ${selectedEmployeeDetails?.full_name || 'Unknown'}`}
        size="xl"
      >
        <div className="p-6 space-y-6">
          {selectedEmployeeDetails && (
            <>
              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground">{selectedEmployeeDetails.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{selectedEmployeeDetails.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{selectedEmployeeDetails.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-foreground">{selectedEmployeeDetails.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-foreground">{selectedEmployeeDetails.date_of_birth || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Work Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-foreground">{selectedEmployeeDetails.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="text-foreground">{selectedEmployeeDetails.department || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Position</label>
                      <p className="text-foreground">{selectedEmployeeDetails.position || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                      <p className="text-foreground">{selectedEmployeeDetails.employee_id || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
                      <p className="text-foreground">{selectedEmployeeDetails.hire_date || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salary</label>
                      <p className="text-foreground">
                        {selectedEmployeeDetails.salary ? `$${selectedEmployeeDetails.salary.toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedEmployeeDetails.skills && selectedEmployeeDetails.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployeeDetails.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedEmployeeDetails.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Bio</h3>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{selectedEmployeeDetails.bio}</p>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {(selectedEmployeeDetails.emergency_contact_name || selectedEmployeeDetails.emergency_contact_phone) && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Contact</h3>
                  <div className="space-y-2">
                    {selectedEmployeeDetails.emergency_contact_name && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-foreground">{selectedEmployeeDetails.emergency_contact_name}</p>
                      </div>
                    )}
                    {selectedEmployeeDetails.emergency_contact_phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-foreground">{selectedEmployeeDetails.emergency_contact_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedEmployeeDetails.attachments && selectedEmployeeDetails.attachments.length > 0 && (
                <AttachmentViewer
                  attachments={selectedEmployeeDetails.attachments}
                  title="Employee Documents"
                />
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
