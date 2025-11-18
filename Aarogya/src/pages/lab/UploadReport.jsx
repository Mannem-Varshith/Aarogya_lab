import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Upload, 
  FileText, 
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function UploadReport() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    testName: '',
    testType: '',
    doctorName: '',
    testDate: '',
    priority: 'normal',
    notes: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const testTypes = [
    'Blood Test',
    'Urine Test',
    'Stool Test',
    'X-Ray',
    'CT Scan',
    'MRI',
    'ECG',
    'Ultrasound',
    'Biopsy',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      // Validate form
      if (!formData.patientName || !formData.patientPhone || !formData.testName || !formData.file) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success
      setSuccess(true);
      setFormData({
        patientName: '',
        patientPhone: '',
        testName: '',
        testType: '',
        doctorName: '',
        testDate: '',
        priority: 'normal',
        notes: '',
        file: null
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Uploaded Successfully!</h2>
              <p className="text-gray-600 mb-4">
                The lab report has been uploaded and is now available to the patient and doctor.
              </p>
              <Button onClick={() => setSuccess(false)} className="w-full">
                Upload Another Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Upload Lab Report</h1>
            <p className="mt-2 text-gray-600">Upload completed lab test results for patients.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Report Details
            </CardTitle>
            <CardDescription>
              Fill in the patient and test information, then upload the report file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Patient Phone *</Label>
                    <Input
                      id="patientPhone"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Test Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name *</Label>
                    <Input
                      id="testName"
                      name="testName"
                      value={formData.testName}
                      onChange={handleInputChange}
                      placeholder="e.g., Complete Blood Count"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select value={formData.testType} onValueChange={(value) => setFormData(prev => ({ ...prev, testType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor Name</Label>
                    <Input
                      id="doctorName"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      placeholder="Enter doctor name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testDate">Test Date</Label>
                    <Input
                      id="testDate"
                      name="testDate"
                      type="date"
                      value={formData.testDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Report File</h3>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Report File *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {formData.file ? (
                      <div className="space-y-2">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                        <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeFile}
                          className="mt-2"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                        </div>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file').click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes or comments..."
                  rows={3}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="min-w-[120px]"
                >
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
