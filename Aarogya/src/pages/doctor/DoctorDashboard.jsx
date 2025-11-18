import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function DoctorDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingReports: 0,
    completedReports: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+91 9876543210',
        age: 35,
        lastVisit: '2024-01-15',
        totalReports: 5
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+91 9876543211',
        age: 28,
        lastVisit: '2024-01-12',
        totalReports: 3
      },
      {
        id: '3',
        name: 'Bob Johnson',
        phone: '+91 9876543212',
        age: 42,
        lastVisit: '2024-01-10',
        totalReports: 7
      }
    ];

    const mockReports = [
      {
        id: '1',
        patientName: 'John Doe',
        testName: 'Complete Blood Count (CBC)',
        date: '2024-01-15',
        status: 'completed',
        priority: 'normal'
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        testName: 'Blood Sugar (Fasting)',
        date: '2024-01-12',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '3',
        patientName: 'Bob Johnson',
        testName: 'Lipid Profile',
        date: '2024-01-10',
        status: 'completed',
        priority: 'normal'
      }
    ];

    setPatients(mockPatients);
    setReports(mockReports);
    setStats({
      totalPatients: mockPatients.length,
      pendingReports: mockReports.filter(r => r.status === 'pending').length,
      completedReports: mockReports.filter(r => r.status === 'completed').length
    });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {user?.name?.split(' ')[1]}!</h1>
            <p className="mt-2 text-gray-600">Manage your patients and review lab reports.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                Active patients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedReports}</div>
              <p className="text-xs text-muted-foreground">
                Reviewed this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Patients
              </CardTitle>
              <CardDescription>
                Find and view patient information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search by name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </CardTitle>
              <CardDescription>
                View patient data trends and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Patient Search Results */}
        {searchQuery && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {filteredPatients.length} patients matching "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">
                          {patient.phone} • Age: {patient.age} • Last visit: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{patient.totalReports} reports</Badge>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        View Reports
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Latest lab reports requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(report.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{report.testName}</h3>
                      <p className="text-sm text-gray-500">
                        Patient: {report.patientName} • {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
