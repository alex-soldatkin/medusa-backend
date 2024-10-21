import React, { useCallback, useState } from "react"
import { RouteConfig } from "@medusajs/admin"
import AIUpload from "../../icons/AIUpload"
import { useDropzone } from 'react-dropzone'
import { Button, Text } from "@medusajs/ui"
import Medusa from "@medusajs/medusa-js"
import { analyseImages } from "../../utils/analyse-images"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

const AIProductUpload = () => {
    const [files, setFiles] = useState([])
    const [uploadStatus, setUploadStatus] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)
    const [error, setError] = useState(null)

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles)
        setIsUploaded(false)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png'],
            'text/csv': ['.csv']
        }
    })

    const handleUpload = async () => {
        setIsLoading(true)
        setUploadStatus('Uploading...')
        try {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append('files', file)
            })

            const response = await medusa.admin.uploads.create(files)
            console.log('Upload response:', response)
            setUploadStatus(`Upload successful! ${response.uploads.length} file(s) uploaded.`)
            setIsUploaded(true)
        } catch (error) {
            console.error('Upload failed:', error)
            setUploadStatus('Upload failed. Please try again.')
            setIsUploaded(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAnalyze = async () => {
        const fileUrls = files.map(file => URL.createObjectURL(file))
        setIsLoading(true)
        setError(null) // Clear any previous errors
        try {
            const results = await analyseImages(fileUrls)
            setAnalysisResults(results)
        } catch (error) {
            console.error('Analysis failed:', error)
            setError(`Analysis failed: ${error.message || 'Unknown error'}`)
            setAnalysisResults(null)
        } finally {
            setIsLoading(false)
        }
    }

    const [analysisResults, setAnalysisResults] = useState(null)

    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">AI Product Upload</h1>
            <div {...getRootProps()} className={`bg-gray-100 p-8 rounded-lg mb-4 text-center cursor-pointer ${isDragActive ? 'border-2 border-dashed border-blue-500' : 'border-2 border-dashed border-gray-300'}`}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <Text>Drop the files here ...</Text> :
                        <Text>Drag 'n' drop some files here, or click to select files</Text>
                }
            </div>
            {files.length > 0 && (
                <div>
                    <Text className="font-semibold mb-2">Selected files:</Text>
                    <ul>
                        {files.map(file => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                    <Button
                        className="mt-4"
                        variant="primary"
                        onClick={isUploaded ? handleAnalyze : handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Uploading...' : (isUploaded ? 'Analyze Files' : 'Upload Files')}
                    </Button>
                    {uploadStatus && <Text className="mt-2">{uploadStatus}</Text>}
                    {analysisResults && (
                        <div className="mt-4">
                            <Text className="font-semibold mb-2">Analysis Results:</Text>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                                {JSON.stringify(analysisResults, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export const config: RouteConfig = {
    link: {
        label: "AI Product Upload",
        icon: AIUpload,
    },
}

export default AIProductUpload