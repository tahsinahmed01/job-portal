export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getOrCreateUser();
    
    if (!user || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(user.companies || []);
  } catch (error) {
    console.error('Error fetching user companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, industry, description, website, logoUrl } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        description,
        website,
        logoUrl,
        ownerId: user.id
      }
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
