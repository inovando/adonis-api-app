module.exports = {
  prompt: ({ inquirer }) => {
    // defining questions in arrays ensures all questions are asked before next prompt is executed
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Name of form? (ex: AddContactForm)',
      },
      {
        type: 'confirm',
        name: 'shouldValidateForm',
        message: 'Do you need to validate the form?',
      },
      {
        type: 'input',
        name: 'formFieldNames',
        message: 'Field names? (separate by comma: "field1, field2,field3")',
      },
    ];

    return inquirer.prompt(questions).then((answers) => {
      const { formFieldNames } = answers;
      const questions = [];

      // these values can be retrieved in the template with: eval(field + '.validation')
      formFieldNames.split(',').forEach((field) => {
        questions.push({
          type: 'input',
          name: field + '.validation',
          message: `Input the validation for ${field} (ex: isBlank(${field}) && '${field} is required')`,
        });
      });

      // both set of answers must be returned as a merged object, else the previous set of answers won't be available to the templates
      return inquirer
        .prompt(questions)
        .then((nextAnswers) => Object.assign({}, answers, nextAnswers));
    });
  },
};
