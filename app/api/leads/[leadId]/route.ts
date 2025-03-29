import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId, Document, Filter } from "mongodb"

interface Lead extends Document {
  _id: ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  callHistory?: Array<{
    date: Date;
    duration: number;
    recording: string | null;
    twilioCallSid: string;
    status: string;
  }>;
  showing?: {
    date: Date;
    time: string;
    status: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const { db } = await connectToDatabase()
    console.log('Searching for lead with ID:', params.leadId)

    // Try to find by ObjectId
    let lead: Lead | null = null;
    try {
      const objectId = new ObjectId(params.leadId);
      lead = await db.collection("leads").findOne({ 
        _id: objectId
      }) as Lead | null;
    } catch (error) {
      console.log('Invalid ObjectId format:', error)
      // If ObjectId conversion fails, try finding by string ID
      lead = await db.collection("leads").findOne({ 
        _id: params.leadId as any
      }) as Lead | null;
    }

    if (!lead) {
      console.log('No lead found with ID:', params.leadId)
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    console.log('Found lead:', lead)
    return NextResponse.json(lead)
  } catch (error) {
    console.error("Fetch lead error:", error)
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const updates = await request.json()

    // Try to find by ObjectId
    let result = null;
    try {
      const objectId = new ObjectId(params.leadId);
      result = await db.collection("leads").findOneAndUpdate(
        { _id: objectId },
        { $set: updates },
        { returnDocument: "after" }
      ) as { value: Lead | null } | null;
    } catch (error) {
      console.log('Invalid ObjectId format:', error)
      // If ObjectId conversion fails, try finding by string ID
      result = await db.collection("leads").findOneAndUpdate(
        { _id: params.leadId as any },
        { $set: updates },
        { returnDocument: "after" }
      ) as { value: Lead | null } | null;
    }

    if (!result?.value) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Update lead error:", error)
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const { db } = await connectToDatabase()

    // Try to delete by ObjectId
    let result = null;
    try {
      const objectId = new ObjectId(params.leadId);
      result = await db.collection("leads").findOneAndDelete({
        _id: objectId
      }) as { value: Lead | null } | null;
    } catch (error) {
      console.log('Invalid ObjectId format:', error)
      // If ObjectId conversion fails, try deleting by string ID
      result = await db.collection("leads").findOneAndDelete({
        _id: params.leadId as any
      }) as { value: Lead | null } | null;
    }

    if (!result?.value) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("Delete lead error:", error)
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    )
  }
} 