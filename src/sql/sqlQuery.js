

const getInventoryListQuery = `SELECT 
inv.inventory_id, 
inv.name as inventory_name, 
inv.location, 
CASE WHEN COUNT(invmap.inventory_id)> 0 THEN json_agg(
  json_build_object(
    'name', p.name, 'type', p.type, 'availableQuantity', 
    invmap.available_quantity, 'price', 
    p.unit_price, 'unitName', p.unit_name, 
    'unitValue', p.unit_value
  )
) ELSE '[]' END as products 
FROM 
supply_management.inventories inv 
LEFT JOIN supply_management.inventory_mapping invmap on invmap.inventory_id = inv.inventory_id 
LEFT JOIN supply_management.products p on p.product_id = invmap.product_id 
GROUP BY 
inv.inventory_id `;



module.exports = {
    getInventoryListQuery
}