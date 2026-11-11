'use client';

import { useState, useEffect } from 'react';
import { Globe, Server, Cloud, Mail, BarChart4, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Define the UserService interface first
interface UserService {
  id: number;
  type: 'domain' | 'hosting' | 'cloud' | 'email' | 'marketing';
  name: string;
  status: 'active' | 'expired' | 'pending';
  renewalDate: string;
  price: number;
}

// User services are now fetched from Supabase database

export default function UserServicesPage() {
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndServices = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Fetch user services from Supabase
        if (user) {
          const { data: userServices, error } = await supabase
            .from('user_services')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching user services:', error);
            // Use empty array instead of mock data
            setServices([]);
          } else {
            // Transform the data to match the interface
            const transformedServices = userServices?.map(service => ({
              id: service.id,
              type: service.type,
              name: service.name,
              status: service.status,
              renewalDate: service.renewal_date,
              price: service.price
            })) || [];
            setServices(transformedServices);
          }
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching user services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndServices();
  }, []);

  // Helper function to get icon based on service type
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return <Globe className="h-6 w-6 text-primary" />;
      case 'hosting':
        return <Server className="h-6 w-6 text-green-600" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-primary" />;
      case 'email':
        return <Mail className="h-6 w-6 text-primary" />;
      case 'marketing':
        return <BarChart4 className="h-6 w-6 text-primary" />;
      default:
        return <Globe className="h-6 w-6 text-muted-foreground" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate total monthly cost
  const totalMonthlyCost = services.reduce((total, service) => total + service.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate">
            My Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your domains, hosting, and other services
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/services/domains"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Service
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Active Services */}
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Server className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Active Services
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-foreground">
                      {services.filter(s => s.status === 'active').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Domains */}
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Domains
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-foreground">
                      {services.filter(s => s.type === 'domain').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Hosting & Cloud */}
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Cloud className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Hosting & Cloud
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-foreground">
                      {services.filter(s => s.type === 'hosting' || s.type === 'cloud').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Cost */}
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Monthly Cost
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-foreground">
                      ${totalMonthlyCost.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-card shadow overflow-hidden sm:rounded-md mb-8">
        <ul className="divide-y divide-border">
          {loading ? (
            <li className="px-6 py-4 flex items-center">
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="rounded-full bg-muted h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </li>
          ) : services.length === 0 ? (
            <li className="px-6 py-12">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No services</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You haven't purchased any services yet.
                </p>
                <div className="mt-6">
                  <Link
                    href="/services/domains"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Link>
                </div>
              </div>
            </li>
          ) : (
            services.map((service) => (
              <li key={service.id}>
                <div className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      {getServiceIcon(service.type)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">
                          {service.name}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : service.status === 'expired'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            Renews on {formatDate(service.renewalDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-foreground mr-4">
                          ${service.price.toFixed(2)}/mo
                        </span>
                        <Link
                          href={`/user/services/${service.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-border shadow-sm text-sm font-medium rounded-md text-muted-foreground bg-card hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                        >
                          Manage
                          <ExternalLink className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Recommended Services */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Recommended Services
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Email Service */}
          {!services.some(s => s.type === 'email') && (
            <div className="bg-card overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">
                      Business Email
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Professional email with your domain
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/services/email"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Marketing Tools */}
          {!services.some(s => s.type === 'marketing') && (
            <div className="bg-card overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <BarChart4 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">
                      Marketing Tools
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Grow your online presence
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/services/marketing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Cloud Services */}
          {!services.some(s => s.type === 'cloud') && (
            <div className="bg-card overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <Cloud className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-foreground">
                      Cloud Services
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Scalable cloud solutions
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href="/services/cloud"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
