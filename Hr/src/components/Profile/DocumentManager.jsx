import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('Resume');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:3000/api/employees/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', docType);

        setUploading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://localhost:3000/api/employees/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setFile(null);
            fetchDocuments();
            alert('Document uploaded successfully');
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:3000/api/employees/documents/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xl font-bold mb-4">Documents</h2>

            {/* Upload Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-semibold mb-3">Upload New Document</h3>
                <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="Resume">Resume</option>
                            <option value="ID Proof">ID Proof</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Contract">Contract</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`px-4 py-2 rounded text-white text-sm font-medium ${!file || uploading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            {/* Document List */}
            <div className="space-y-3">
                {documents.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No documents uploaded yet.</p>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded text-blue-600">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-800">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.type} • {(doc.file_size / 1024).toFixed(2)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`http://localhost:3000/${doc.file_path.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Download"
                                >
                                    <i className="fas fa-download"></i>
                                </a>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentManager;
