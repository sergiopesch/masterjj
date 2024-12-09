# MasterJJ - BJJ Training Platform

A modern platform for Brazilian Jiu-Jitsu practitioners and instructors to enhance their training experience through technology. Built with Next.js and secured with passwordless authentication.

## 🥋 Features

- **Smart Scheduling**: Get personalized class recommendations based on your skill level and availability
- **HD Video Library**: Access high-quality technique videos from world-class instructors
- **Progress Tracking**: Monitor your improvement with advanced analytics
- **Community Integration**: Connect with training partners and join technique study groups
- **Achievement System**: Track your progression with badges and milestones
- **Technique Journal**: Document your learning journey with notes, videos, and insights
- **Secure Authentication**: Passwordless email authentication for enhanced security

## 🚀 Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Supabase
- **Animation**: Framer Motion
- **Icons**: Lucide Icons

## 🛠️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sergiopesch/masterjj.git
   cd masterjj
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application running.

## 🔐 Authentication Flow

The application uses Supabase's passwordless authentication:
1. Users enter their email address
2. A magic link is sent to their email
3. Clicking the link authenticates them securely
4. No passwords to remember or manage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
