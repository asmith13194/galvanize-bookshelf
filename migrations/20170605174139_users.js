exports.up = function(knex, Promise) {
    return knex.schema.createTable('users',(table)=>{
      table.increments('id').primary();
      table.string('first_name').notNullable().defaultTo('');
      table.string('last_name').notNullable().defaultTo('');
      table.string('email').notNullable().unique();
      table.specificType('hashed_password','char(60)').notNullable();
      table.timestamp('created_at').notNull().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNull().defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {

};
