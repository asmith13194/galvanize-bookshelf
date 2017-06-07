'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

  production: {
    client: 'pg',
    connection: 'postgres://gsijtajtbetezb:bfcd5b2f7f6e5152e8a05b04ecb414af6ab9d6f7e60c1b6be9d0391c5b3959cf@ec2-50-19-219-69.compute-1.amazonaws.com:5432/d6m76shcploh3j'
  }
};
