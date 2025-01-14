# Four Favorites 🎬

A curated collection of Letterboxd's Four Favorites celebrity picks, where
renowned filmmakers, actors, and critics share their all-time favorite movies.
Inspired by this concept, users can also create and share their own personal
Four Favorites lists, making it a growing community of film enthusiasts and
their most cherished movies.

## ✨ Features

- **Celebrity Lists**: Browse through Letterboxd's collection of Four Favorites
  from famous filmmakers, actors, and critics
- **Personal Collections**: Create and share your own Four Favorites movie list
- **Movie Search**: Powered by TMDB API for comprehensive movie data
- **User Authentication**: Secure authentication powered by Clerk
- **Responsive Design**: Beautiful, modern UI that works across all devices
- **Social Features**: Like and share favorite lists from other users
- **Advanced Filtering**: Sort and filter lists by various criteria (role, name,
  publishing date)
- **Real-time Updates**: Instant updates using Next.js server actions
- **Beautiful Animations**: Smooth transitions and interactions using Framer
  Motion

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with
  [shadcn/ui](https://ui.shadcn.com/)
- **Database**: PostgreSQL ([Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **UI/UX**:
  - [Framer Motion](https://www.framer.com/motion/)
  - [Embla Carousel](https://www.embla-carousel.com/)
  - [Phosphor Icons](https://phosphoricons.com/)
- **Development**:
  - TypeScript
  - ESLint
  - Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- PostgreSQL database (or Neon account)
- TMDB API key
- Clerk account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/four-favorites.git
   cd four-favorites
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables: Create a `.env.local` file with the following
   variables:

   ```env
   # Database
   DATABASE_URL=your_database_url

   # TMDB API
   TMDB_READ_TOKEN=your_tmdb_api_token

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Initialize the database:

   ```bash
   bun run generate   # Generate migrations
   bun run push      # Push to database
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

Visit `http://localhost:3000` to see the application running.

## 📦 Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run generate` - Generate Drizzle migrations
- `bun run push` - Push migrations to database
- `bun run studio` - Open Drizzle Studio

## 🔑 Environment Variables

| Variable                            | Description                  |
| ----------------------------------- | ---------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string |
| `TMDB_READ_TOKEN`                   | TMDB API read access token   |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key             |
| `CLERK_SECRET_KEY`                  | Clerk secret key             |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their comprehensive movie database
- [Letterboxd](https://letterboxd.com/) for the inspiration
- All the amazing open-source libraries that made this project possible
