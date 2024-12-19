/*Without ORM tool
const connection = require('../Utility/database');

module.exports = class Category{
    constructor(name,description){
        this.id = (categories.length + 1).toString();
        this.name = name;
        this.description = description;
    }

    saveCategory(){
        return connection.execute('INSERT INTO categories(name,description) VALUES(?,?)',[this.name,this.description]);
    }

    static getAll(){
        return connection.execute('SELECT * FROM categories')
    }

    static getById(id) {
        return connection.execute('SELECT * FROM categories WHERE id=?',[id]);
    }

    static Update(category){
        return connection.execute('UPDATE categories SET categories.name=?,categories.description=?',[category.name,category.description]);
    }

    static deleteById(id){
        return connection.execute('DELETE FROM categories WHERE id=?',[id]);
    }

}
*/
//With Sequelize ORM Tool
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../Utility/database');

const Category = sequelize.define('category',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    description:{
        type: DataTypes.STRING,
        allowNull:true
    }
});

module.exports = Category;