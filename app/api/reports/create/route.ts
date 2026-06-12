// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { title, description, category, severity, latitude, longitude, address, date, images, isAnonymous } = body;

//     // Validation
//     if (!title || !description || !category || !date) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const report = await prisma.report.create({
//       data: {
//         title,
//         description,
//         category,
//         severity: severity || "MEDIUM",
//         latitude: latitude || null,
//         longitude: longitude || null,
//         address: address || null,
//         date: new Date(date),
//         images: images || [],
//         userId: session.user.id,
//         isAnonymous: isAnonymous || false,
//         status: "PENDING"
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       report
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Create report error:", error);
//     return NextResponse.json(
//       { error: "Failed to create report" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, description, category, severity, latitude, longitude, 
      address, dateOfOccurring, images, isAnonymous, victims, contactNumber, nearbyStations
    } = body;

    if (!title || !description || !category || !dateOfOccurring) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        severity: severity || "MEDIUM",
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
        date: new Date(dateOfOccurring),
        victims: victims || null,
        contactNumber: contactNumber || null,
        nearbyStations: nearbyStations || null,
        images: images || [],
        userId: anonymousId,
        isAnonymous: true,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      report
    }, { status: 201 });

  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}