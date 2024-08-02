import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'data.json');

export async function GET() {
  console.log('GET request received');
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log('Data read successfully');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading data file:', err);
    return NextResponse.json({ error: 'Error reading data file' }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('POST request received');
  try {
    const tasks = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), 'utf8');
    console.log('Data written successfully')
    return NextResponse.json({ message: 'Tasks updated' });
  } catch (err) {
    console.error('Error writing data file:', err);
    return NextResponse.json({ error: 'Error writing data file' }, { status: 500 });
  }
}
