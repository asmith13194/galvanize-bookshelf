exports.up = function(knex, Promise) {
    return knex.schema.createTable('favorites',(table)=>{
      table.increments('id');
      table.integer('book_id').unsigned().index().references('id').inTable('books').onDelete('cascade').notNullable()
      table.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade').notNullable()
      table.timestamp('created_at').notNull().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNull().defaultTo(knex.fn.now());

    })
};

exports.down = function(knex, Promise) {

};
