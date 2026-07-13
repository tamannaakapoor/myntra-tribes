const supabase = require("../config/supabase");


const saveLookbook = async ({
  avatarId,
  title,
  description,
  tags,
  items,
}) => {

  // Create lookbook
  const { data: lookbook, error } = await supabase
    .from("lookbooks")
    .insert({
      avatar_id: avatarId,
      title,
      description,
      tags,
    })
    .select()
    .single();

  if (error) throw error;

  // Prepare lookbook items
  const lookbookItems = items.map((item) => ({
    lookbook_id: lookbook.id,
    product_id: item.product_id,
  }));

  const { error: itemError } = await supabase
    .from("lookbook_items")
    .insert(lookbookItems);

  if (itemError) throw itemError;

  return lookbook;
};

module.exports = {
  saveLookbook,
};