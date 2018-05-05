
function testy() // Yes I made it really ugly to adjust difficulty.
{



	var problemGenerator = {};

	/*
	 * Constructor function
	 */
	problemGenerator.ProblemGeneratorView = function(difficulty) 
	{
		var self = this;

		self.operators = ['+','-','*','/'];
		self.difficulty = difficulty;

		/*
		 * Get a random digit 1-10
		 */
		self.getDigit = function(min,max) 
		{
			return (Math.floor((Math.random() * max) + min));
		};

		/*
		 * get random operation +, -, *, /
		 */
		self.getOperator = function(numberOfOperations) 
		{
			return self.operators[Math.floor((Math.random() * numberOfOperations) + 0)];
		};

		/*
		 * get the solution from the problem parameters
		 */
		self.evaluateSolution = function(a, b, operator) 
		{
			var solution = null;

			if (operator === "+") {
				solution = a + b;
			}
			if (operator === '-') {
				solution = a - b;
			}
			if (operator === '*') {
				solution = a * b;
			}
			if (operator === '/') {
				solution = a / b;
			}
			return solution;
		};

		/*
		 * Validate the User's attempt
		 */
		self.isAttemptCorrect = function(attempt, solution) 
		{
			if (attempt === solution) {
				return true;
			} else {
				return false;
			}
		};

		/*
		 * get problem array firstDigit, Operator, secondDigit, solution
		 */
		self.setRandomProblem = function(difficulty) 
		{
			var a = null;
			var b = null;
			var operator = null;
			var solution = null;

			if (difficulty == 1) 
			{
				a = self.getDigit(1,20);
				b = self.getDigit(1,20);
				operator = self.getOperator(0); //sum
			}

			if (difficulty == 2)  //sum and negative
			{
				a = self.getDigit(1,40);
				b = self.getDigit(1,20);
				operator = self.getOperator(2);

				if (operator === "-")
				{
					while (a < b)
					{
						a = self.getDigit(1,40);
						b = self.getDigit(1,20);
					}
				}
			}
			if (difficulty == 3)  //EVERYTHING
			{
				a = self.getDigit(1,100);
				b = self.getDigit(1,33);
				operator = self.getOperator(4);


				if (operator === "-")
				{
					a = self.getDigit(1,100);
					b = self.getDigit(1,33);
					while (a < b)
					{
						a = self.getDigit(1,100);
						b = self.getDigit(1,33);
					}
				}

				if (operator === "*")
				{
					while (a%b!=0)
					{
						a = self.getDigit(1,100);
						b = self.getDigit(1,10);
					}
				}

				if (operator === "/")
				{
					while (a%b!=0)
					{
						a = self.getDigit(1,100);
						b = self.getDigit(1,33);
					}
				}
			}

			solution = self.evaluateSolution(a, b, operator);

			return [a, operator, b, solution];
		};

		return self;
	};

	return problemGenerator;
}

problemGen = new testy();

alert(problemGen.ProblemGeneratorView().setRandomProblem(3));