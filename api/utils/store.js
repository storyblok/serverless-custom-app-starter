const { merge } = require('lodash')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_DB_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = {
  // select
  get: async (sid) => {
    const { data: session_storage } = await supabase
      .from('session_storage')
      .select('sid, json')
      .eq('sid', sid)
    return session_storage && session_storage.length
      ? session_storage[0].json
      : {}
  },
  // upsert
  set: async (sid, json) => {
    // get the previous set item
    const { data: session_storage } = await supabase
      .from('session_storage')
      .select('sid, json')
      .eq('sid', sid)

    if (session_storage && session_storage.length) {
      const fullJson = merge(session_storage[0].json, json)
      // set the json object
      await supabase
        .from('session_storage')
        .update({ json: fullJson })
        .match({ sid })
    } else {
      await supabase
        .from('session_storage')
        .insert([{ sid, json }], { upsert: true })
    }
  },
  // delete
  remove: async (sid) => {
    await supabase.from('session_storage').delete().match({ sid })
  },
}