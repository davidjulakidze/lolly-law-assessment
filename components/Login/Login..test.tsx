import { render, screen, userEvent } from '@/test-utils';
import { Login } from './Login';

describe('Login component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders the main title', () => {
      render(<Login />);
      expect(screen.getByText('Welcome to LollyLaw')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      render(<Login />);
      expect(
        screen.getByText('Please sign in to your account or create a new one')
      ).toBeInTheDocument();
    });

    it('renders both tabs', () => {
      render(<Login />);
      expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
    });

    it('renders the contact support link', () => {
      render(<Login />);
      expect(screen.getByText('Contact support')).toBeInTheDocument();
    });

    it('has login tab active by default', () => {
      render(<Login />);
      expect(screen.getByRole('tab', { name: /sign in/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('tab', { name: /sign up/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });
  });

  // Tab switching tests
  describe('Tab Navigation', () => {
    it('switches to signup tab when clicked', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      await user.click(signUpTab);

      expect(signUpTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /sign in/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('switches back to login tab when clicked', async () => {
      const user = userEvent.setup();
      render(<Login />);

      // First switch to signup
      await user.click(screen.getByRole('tab', { name: /sign up/i }));

      // Then switch back to login
      const loginTab = screen.getByRole('tab', { name: /sign in/i });
      await user.click(loginTab);

      expect(loginTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: /sign up/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });
  });

  // Login form tests
  describe('Login Form', () => {
    it('renders login form fields', () => {
      render(<Login />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      render(<Login />);
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('allows typing in email field', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('allows typing in password field', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByLabelText(/^password/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('allows checking remember me checkbox', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const checkbox = screen.getByRole('checkbox', { name: /remember me/i });
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('shows validation error for invalid email', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('shows validation error for short password', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByLabelText(/^password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, '123');
      await user.click(submitButton);

      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  // Signup form tests
  describe('Sign Up Form', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<Login />);
      await user.click(screen.getByRole('tab', { name: /sign up/i }));
    });

    it('renders signup form fields', () => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /accept.*terms/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('allows typing in all form fields', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/^password/i)).toHaveValue('password123');
      expect(screen.getByLabelText(/confirm password/i)).toHaveValue('password123');
    });

    it('shows validation error for short first name', async () => {
      const user = userEvent.setup();

      const firstNameInput = screen.getByLabelText(/first name/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(firstNameInput, 'J');
      await user.click(submitButton);

      expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
    });

    it('shows validation error for short last name', async () => {
      const user = userEvent.setup();

      const lastNameInput = screen.getByLabelText(/last name/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(lastNameInput, 'D');
      await user.click(submitButton);

      expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('shows validation error for password mismatch', async () => {
      const user = userEvent.setup();

      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');
      await user.click(submitButton);

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('shows validation error when terms are not accepted', async () => {
      const user = userEvent.setup();

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });

    it('allows checking terms and conditions checkbox', async () => {
      const user = userEvent.setup();

      const termsCheckbox = screen.getByRole('checkbox', { name: /accept.*terms/i });
      await user.click(termsCheckbox);

      expect(termsCheckbox).toBeChecked();
    });

    it('renders terms and conditions link', () => {
      expect(screen.getByText('terms and conditions')).toBeInTheDocument();
    });
  });

  // Form submission tests
  describe('Form Submission', () => {
    it('can submit valid login form without errors', async () => {
      const user = userEvent.setup();
      render(<Login />);

      // Fill in valid data
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Should not show validation errors
      expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
      expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
    });

    it('can submit valid signup form without errors', async () => {
      const user = userEvent.setup();
      render(<Login />);

      // Switch to signup tab
      await user.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill in valid data
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('checkbox', { name: /accept.*terms/i }));

      // Submit form
      await user.click(screen.getByRole('button', { name: /create account/i }));

      // Should not show validation errors
      expect(
        screen.queryByText('First name must be at least 2 characters')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Last name must be at least 2 characters')).not.toBeInTheDocument();
      expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
      expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      expect(
        screen.queryByText('You must accept the terms and conditions')
      ).not.toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<Login />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<Login />);

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('has proper tab roles and attributes', () => {
      render(<Login />);

      const loginTab = screen.getByRole('tab', { name: /sign in/i });
      const signupTab = screen.getByRole('tab', { name: /sign up/i });

      expect(loginTab).toHaveAttribute('aria-selected', 'true');
      expect(signupTab).toHaveAttribute('aria-selected', 'false');
    });

    it('has proper form structure', () => {
      render(<Login />);

      // Check that form elements are properly associated
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('type', 'password');
    });
  });
});
