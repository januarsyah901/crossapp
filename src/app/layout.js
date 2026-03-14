import './globals.css';

export const metadata = {
  title: 'Simple X Clone',
  description: 'Simple Twitter/X Integration with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
