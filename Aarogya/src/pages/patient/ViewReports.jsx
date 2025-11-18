import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function ViewReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockReports = [
      {
        id: '1',
        testName: 'Complete Blood Count (CBC)',
        date: '2024-01-15',
        status: 'completed',
        lab: 'Aarogya Lab',
        doctor: 'Dr. Smith',
        fileSize: '2.3 MB',
        downloadCount: 3
      },
      {
        id: '2',
        testName: 'Blood Sugar (Fasting)',
        date: '2024-01-10',
        status: 'pending',
        lab: 'Aarogya Lab',
        doctor: 'Dr. Johnson',
        fileSize: '1.8 MB',
        downloadCount: 0
      },
      {
        id: '3',
        testName: 'Lipid Profile',
        date: '2024-01-08',
        status: 'completed',
        lab: 'Aarogya Lab',
        doctor: 'Dr. Brown',
        fileSize: '3.1 MB',
        downloadCount: 1
      },
      {
        id: '4',
        testName: 'Thyroid Function Test',
        date: '2024-01-05',
        status: 'completed',
        lab: 'Aarogya Lab',
        doctor: 'Dr. Davis',
        fileSize: '2.7 MB',
        downloadCount: 2
      },
      {
        id: '5',
        testName: 'Liver Function Test',
        date: '2024-01-03',
        status: 'pending',
        lab: 'Aarogya Lab',
        doctor: 'Dr. Wilson',
        fileSize: '2.1 MB',
        downloadCount: 0
      }
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.lab.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, reports]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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

  const handleDownload = (reportId) => {
    // Mock download functionality
    console.log(`Downloading report ${reportId}`);
    // In real app, this would trigger actual file download
  };

  const handleView = (reportId) => {
    // Mock view functionality
    console.log(`Viewing report ${reportId}`);
    // In real app, this would open report viewer
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Lab Reports</h1>
            <p className="mt-2 text-gray-600">View and download your lab test results.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>
              Find specific reports using search or filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by test name, doctor, or lab..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Reports ({filteredReports.length})</CardTitle>
            <CardDescription>
              Your lab test results and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You don\'t have any lab reports yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(report.status)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{report.testName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {report.date}
                          </span>
                          <span>Dr. {report.doctor}</span>
                          <span>{report.lab}</span>
                          <span>{report.fileSize}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(report.status)}
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(report.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {report.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
