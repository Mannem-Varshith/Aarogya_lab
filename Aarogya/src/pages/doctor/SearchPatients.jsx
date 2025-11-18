import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  FileText, 
  User,
  Phone,
  Calendar,
  Filter,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function SearchPatients() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+91 9876543210',
        email: 'john.doe@email.com',
        age: 35,
        gender: 'Male',
        lastVisit: '2024-01-15',
        totalReports: 5,
        lastReport: 'Complete Blood Count (CBC)',
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+91 9876543211',
        email: 'jane.smith@email.com',
        age: 28,
        gender: 'Female',
        lastVisit: '2024-01-12',
        totalReports: 3,
        lastReport: 'Blood Sugar (Fasting)',
        status: 'active'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        phone: '+91 9876543212',
        email: 'bob.johnson@email.com',
        age: 42,
        gender: 'Male',
        lastVisit: '2024-01-10',
        totalReports: 7,
        lastReport: 'Lipid Profile',
        status: 'active'
      },
      {
        id: '4',
        name: 'Alice Wilson',
        phone: '+91 9876543213',
        email: 'alice.wilson@email.com',
        age: 31,
        gender: 'Female',
        lastVisit: '2024-01-08',
        totalReports: 2,
        lastReport: 'Thyroid Function Test',
        status: 'active'
      }
    ];

    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    // Mock patient reports - replace with actual API call
    const mockReports = [
      {
        id: '1',
        testName: 'Complete Blood Count (CBC)',
        date: '2024-01-15',
        status: 'completed',
        priority: 'normal'
      },
      {
        id: '2',
        testName: 'Blood Sugar (Fasting)',
        date: '2024-01-10',
        status: 'pending',
        priority: 'high'
      },
      {
        id: '3',
        testName: 'Lipid Profile',
        date: '2024-01-08',
        status: 'completed',
        priority: 'normal'
      }
    ];
    setPatientReports(mockReports);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Search Patients</h1>
            <p className="mt-2 text-gray-600">Find and view patient information and reports.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Patients</CardTitle>
                <CardDescription>
                  Find patients by name, phone, or email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Search Results ({filteredPatients.length})</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{patient.name}</p>
                              <p className="text-sm text-gray-500 truncate">{patient.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details and Reports */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedPatient.name}</h3>
                        <p className="text-sm text-gray-500">{selectedPatient.gender}, {selectedPatient.age} years</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedPatient.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Last visit: {selectedPatient.lastVisit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Patient Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Patient Reports ({patientReports.length})
                    </CardTitle>
                    <CardDescription>
                      Lab test results for {selectedPatient.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-medium text-gray-900">{report.testName}</h3>
                              <p className="text-sm text-gray-500">{report.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(report.status)}
                            {getPriorityBadge(report.priority)}
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                    <p className="text-gray-500">
                      Choose a patient from the search results to view their information and reports.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
