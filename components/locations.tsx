'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const OfficeLocationsMap = () => {
    const [selectedOffice, setSelectedOffice] = useState(0);

    // Office location data
    const offices = [
        {
            id: 1,
            name: "FormiqStudio System Inc",
            address: "West Bengal India, Durgapur,713212",
            phone: "+1 555-341-9743",
            email: "hello@formiqstudio.in",
            coordinates: { lat: 23.55000000, lng: -87.32000000 },
            mapUrl: "https://maps.google.com/maps?q=Durgapur+City+Centre+West+Bengal&t=&z=13&ie=UTF8&iwloc=&output=embed"
        },
        {
            id: 2,
            name: "Opening Soon",
            address: "Kolkata, West Bengal, India",
            phone: "XXX-XXX-XXXX",
            email: "kolkata@formiqstudio.com",
            coordinates: { lat: 40.7128, lng: -74.0060 },
            mapUrl: "https://maps.google.com/maps?q=Kolkata+West+Bengal&t=&z=13&ie=UTF8&iwloc=&output=embed"
        },
        {
            id: 3,
            name: "Opening Soon",
            address: "Chennai, Tamil Nadu, India",
            phone: "XXX-XXX-XXXX",
            email: "chennai@formiqstudio.com",
            coordinates: { lat: 51.5074, lng: -0.1278 },
            mapUrl: "https://maps.google.com/maps?q=Query+One+Tamil+Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
        }
    ];

    return (
        <div className="w-full relative bg-gradient-to-b from-background to-background/90 py-8 md:py-16">
            {/* Background elements to match the Hero component style */}
            <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
                <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3182ce,transparent)]" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)] opacity-50" />
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]" />

            <div className="container relative z-10 px-4 sm:px-6 mx-auto">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70">Our Global Presence</h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">Visit us at one of our office locations around the world.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                    {/* Offices list */}
                    <div className="lg:col-span-4 space-y-3 md:space-y-4">
                        {offices.map((office, index) => (
                            <Card
                                key={office.id}
                                className={`cursor-pointer transition-colors duration-200 hover:shadow-lg border ${selectedOffice === index ? 'border-primary/30 bg-primary/5' : 'border-primary/10 bg-background/75'}`}
                                onClick={() => setSelectedOffice(index)}
                            >
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                        <div className={`p-2 md:p-3 rounded-full ${selectedOffice === index ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                            <MapPin className={`w-4 h-4 md:w-5 md:h-5 ${selectedOffice === index ? 'text-primary' : 'text-primary/70'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base md:text-lg mb-1 truncate">{office.name}</h3>
                                            <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-3">{office.address}</p>
                                            <div className="space-y-1 md:space-y-2">
                                                <div className="flex items-center text-xs md:text-sm">
                                                    <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary/70 flex-shrink-0" />
                                                    <span className="truncate">{office.phone}</span>
                                                </div>
                                                <div className="flex items-center text-xs md:text-sm">
                                                    <Mail className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-primary/70 flex-shrink-0" />
                                                    <span className="truncate">{office.email}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 md:mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs hover:bg-primary/5 transition-colors duration-300 border-primary/20 h-8 px-2 md:px-3"
                                                >
                                                    <Navigation className="w-3 h-3 mr-1" />
                                                    Get Directions
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Map display */}
                    <div className="lg:col-span-8 mt-4 lg:mt-0">
                        <Card className="border border-primary/10 bg-background/75  shadow-lg overflow-hidden h-full">
                            <CardHeader className="p-3 sm:p-4 md:pb-2">
                                <CardTitle className="text-base sm:text-lg md:text-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <span className="truncate">{offices[selectedOffice].name}</span>
                                    <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 text-primary/80 h-7 px-2">
                                        <span>View Larger Map</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-background to-gray-100/10 dark:to-gray-800/20">
                                    <iframe
                                        title={`Map of ${offices[selectedOffice].name}`}
                                        src={offices[selectedOffice].mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0"
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficeLocationsMap;