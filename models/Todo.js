module.exports = function(sequelize, DataTypes) {
  const Todo = sequelize.define("Todo", {
    task: {
      type: DataTypes.STRING,
      unique: true
    },
    done: DataTypes.BOOLEAN
  });
  return Todo;
};