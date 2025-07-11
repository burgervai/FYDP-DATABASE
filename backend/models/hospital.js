const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Hospital name is required',
        },
        len: {
          args: [2, 255],
          msg: 'Hospital name must be between 2 and 255 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[\d\s+()-]+$/,
          msg: 'Invalid phone number format',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address',
        },
      },
    },
  }, {
    tableName: 'hospitals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (hospital) => {
        if (hospital.name && !hospital.slug) {
          hospital.slug = slugify(hospital.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          });
        }
      },
    },
  });

  // Instance methods
  Hospital.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.created_at;
    delete values.updated_at;
    return values;
  };

  // Class methods
  Hospital.associate = (models) => {
    Hospital.hasMany(models.User, {
      foreignKey: 'hospital_id',
      as: 'users',
    });
    
    Hospital.hasMany(models.Patient, {
      foreignKey: 'hospital_id',
      as: 'patients',
    });
  };

  return Hospital;
};
