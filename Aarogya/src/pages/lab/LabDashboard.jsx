import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Upload, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function LabDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    todayReports: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockReports = [
      {
        id: '1',
        patientName: 'John Doe',
        testName: 'Complete Blood Count (CBC)',
        date: '2024-01-15',
        status: 'completed',
        priority: 'normal',
        doctor: 'Dr. Smith'
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        testName: 'Blood Sugar (Fasting)',
        date: '2024-01-15',
        status: 'pending',
        priority: 'high',
        doctor: 'Dr. Johnson'
      },
      {
        id: '3',
        patientName: 'Bob Johnson',
        testName: 'Lipid Profile',
        date: '2024-01-14',
        status: 'completed',
        priority: 'normal',
        doctor: 'Dr. Brown'
      },
      {
        id: '4',
        patientName: 'Alice Wilson',
        testName: 'Thyroid Function Test',
        date: '2024-01-15',
        status: 'pending',
        priority: 'normal',
        doctor: 'Dr. Davis'
      }
    ];

    setReports(mockReports);
    setStats({
      totalReports: mockReports.length,
      pendingReports: mockReports.filter(r => r.status === 'pending').length,
      completedReports: mockReports.filter(r => r.status === 'completed').length,
      todayReports: mockReports.filter(r => r.date === '2024-01-15').length
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

  const handleUploadReport = () => {
    // Navigate to upload page or open upload modal
    window.location.href = '/lab-upload-report';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Manage lab operations and upload test reports.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                All time reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todayReports}</div>
              <p className="text-xs text-muted-foreground">
                Generated today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
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
                Ready for delivery
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload New Report
              </CardTitle>
              <CardDescription>
                Upload completed lab test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleUploadReport} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Upload Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Lab Analytics
              </CardTitle>
              <CardDescription>
                View lab performance and statistics
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

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Latest lab reports and their status
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
                        Patient: {report.patientName} • Doctor: {report.doctor} • {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                      {report.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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
