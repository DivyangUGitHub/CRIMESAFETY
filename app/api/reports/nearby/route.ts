// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const lat = parseFloat(searchParams.get("lat") || "0");
//     const lng = parseFloat(searchParams.get("lng") || "0");
//     const radius = parseFloat(searchParams.get("radius") || "5"); // km
//     const limit = parseInt(searchParams.get("limit") || "20");

//     if (!lat || !lng) {
//       return NextResponse.json(
//         { error: "Latitude and longitude are required" },
//         { status: 400 }
//       );
//     }

//     // MongoDB geospatial query
//     const reports = await prisma.report.findMany({
//       where: {
//         latitude: { not: null },
//         longitude: { not: null },
//         status: { not: "REJECTED" }
//       },
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: {
//           select: {
//             name: true,
//             image: true
//           }
//         }
//       }
//     });

//     // Calculate distance and filter by radius (simplified)
//     const nearbyReports = reports.filter(report => {
//       if (!report.latitude || !report.longitude) return false;
//       const distance = getDistanceFromLatLonInKm(lat, lng, report.latitude, report.longitude);
//       return distance <= radius;
//     });

//     return NextResponse.json({
//       success: true,
//       reports: nearbyReports,
//       count: nearbyReports.length
//     });

//   } catch (error) {
//     console.error("Nearby reports error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch nearby reports" },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to calculate distance between coordinates
// function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const R = 6371; // Earth's radius in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function deg2rad(deg: number): number {
//   return deg * (Math.PI / 180);
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "5");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        status: { not: "REJECTED" }
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    const nearbyReports = reports.filter(report => {
      if (!report.latitude || !report.longitude) return false;
      const distance = getDistanceFromLatLonInKm(lat, lng, report.latitude, report.longitude);
      return distance <= radius;
    });

    return NextResponse.json({
      success: true,
      reports: nearbyReports,
      count: nearbyReports.length
    });

  } catch (error) {
    console.error("Nearby reports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby reports" },
      { status: 500 }
    );
  }
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}