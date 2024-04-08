import { Schema, model } from 'mongoose';

const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const employeeSchema = new Schema({
    first_name: {
        type: String,
        required: [true,'First name is required'],
        trim: true
      },
      last_name: {
        type: String,
        required: [true,'Last name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return emailPattern.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
      },
      gender: {
        type: String,

        required: true,
        enum: ['Male', 'Female','Other']
      },
      salary: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v > 0
            },
            message: props => `${props.value} is not a valid salary!`
        }
      }
});

export default model("Employee", employeeSchema);