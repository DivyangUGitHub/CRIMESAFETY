import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      description,
      latitude,
      longitude,
      address,
      dateOfOccurring,
      timeOfOccurring,
      victims,
      contactNumber,
      nearbyStations,
      images,
    } = body;

    // Validation
    if (!title || !category || !description || !dateOfOccurring) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate anonymous ID
    const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Create report
    const report = await prisma.report.create({
      data: {
        title,
        category,
        description,
        latitude: latitude || null,
        longitude: longitude || null,
        address: address || null,
        date: new Date(dateOfOccurring),
        time: timeOfOccurring || null,
        victims: victims || null,
        contactNumber: contactNumber || null,
        nearbyStations: nearbyStations || null,
        images: images || [],
        isAnonymous: true,
        status: "PENDING",
        severity: "MEDIUM",
        userId: anonymousId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Report submitted successfully", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}