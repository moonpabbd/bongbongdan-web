const { projectId } = require('./utils/supabase/info.cjs'); // wait, I'll just hardcode the project ref
const fetch = require('node-fetch');

const SERVER = `https://ibvnydmuooorpuopdywr.supabase.co/functions/v1/server`;

async function test() {
  console.log('Testing GET categories...');
  const res1 = await fetch(`${SERVER}/schedule-categories`);
  const data1 = await res1.json();
  console.log('Categories:', data1);
}

test();
