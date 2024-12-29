"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Incident {
    id: string;
    description: string;
    status: string;
    category: string;
    department: {
        _id: string;
        name: string;
        description: string;
        logo_url: string;
    }
    created_at: string;
}

export default function ViewMyIncidencePage() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { token } = useAuth();

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/user/incidents`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIncidents(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching incidents:', error);
                setIsLoading(false);
            }
        };

        fetchIncidents();
    }, [token]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500 text-yellow-900'
            case 'in progress':
                return 'bg-blue-500 text-blue-900'
            case 'resolved':
                return 'bg-green-500 text-green-900'
            default:
                return 'bg-gray-500 text-gray-900'
        }
    }

    const IncidentSkeleton = () => (
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );

    const MobileIncidentCard = ({ incident }: { incident: Incident }) => (
        <Card className="mb-4">
            <CardContent className="pt-6">
                <p className="font-semibold mb-2">{incident.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="font-medium">Status:</span>
                        <Badge className={`ml-2 ${getStatusColor(incident.status)}`}>
                            {incident.status}
                        </Badge>
                    </div>
                    <div>
                        <span className="font-medium">Category:</span> {incident.category}
                    </div>
                    <div>
                        <span className="font-medium">Department:</span> {incident.department.name}
                    </div>
                    <div>
                        <span className="font-medium">Reported On:</span> {new Date(incident.created_at).toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">My Reported Incidents</CardTitle>
                    <CardDescription>View and track the status of your reported incidents</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <IncidentSkeleton />
                    ) : incidents.length === 0 ? (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No incidents found</AlertTitle>
                            <AlertDescription>
                                You haven&apos;t reported any incidents yet. When you do, they&apos;ll appear here.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            {/* Mobile view */}
                            <div className="md:hidden space-y-4">
                                {incidents.map((incident) => (
                                    <MobileIncidentCard key={incident.id} incident={incident} />
                                ))}
                            </div>

                            {/* Desktop view */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[300px]">Description</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Reported On</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {incidents.map((incident) => (
                                            <TableRow key={incident.id}>
                                                <TableCell className="font-medium">{incident.description}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(incident.status)}>
                                                        {incident.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{incident.category}</TableCell>
                                                <TableCell>{incident.department.name}</TableCell>
                                                <TableCell>{new Date(incident.created_at).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

