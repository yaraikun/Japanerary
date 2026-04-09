import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../.data/data.json');

if (!fs.existsSync(dataPath)) {
  throw new Error(`Data file not found at ${dataPath}`);
}

const rawData = fs.readFileSync(dataPath, 'utf-8');
const { days, items } = JSON.parse(rawData);

async function seed() {
  console.log('Starting seed from external data...');
  
  try {
    console.log('Deleting existing items...');
    const { error: deleteItemsError } = await supabase
      .from('items')
      .delete()
      .neq('id', 0);
    if (deleteItemsError) throw deleteItemsError;

    console.log('Deleting existing days...');
    const { error: deleteDaysError } = await supabase
      .from('days')
      .delete()
      .neq('id', 0);
    if (deleteDaysError) throw deleteDaysError;

    console.log('Inserting days...');
    const { error: insertDaysError } = await supabase
      .from('days')
      .insert(days);
    if (insertDaysError) throw insertDaysError;

    console.log('Inserting items...');
    const { error: insertItemsError } = await supabase
      .from('items')
      .insert(items);
    if (insertItemsError) throw insertItemsError;

    console.log('Seed completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
