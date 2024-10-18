<template>
    <button class="btn-cancel" @click="cancelEditing">Cancel</button>
  </template>
  
  <script>
  export default {
    name: 'CancelButton',
    methods: {
      cancelEditing() {
        this.$emit('cancel-editing')
      }
    }
  }
  </script>
  
  <style scoped>
  .btn-cancel {
    width: 100%;
    padding: 10px;
    background-color: #e74c3c; /* Red color */
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .btn-cancel:hover {
    background-color: #c0392b; /* Darker red on hover */
  }
  
  .btn-cancel:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>
  