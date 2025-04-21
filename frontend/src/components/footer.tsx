export const Footer: React.FC = () => {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center text-sm">
      <p>© {new Date().getFullYear()} TaskFlow. Built with ❤️ by xAI.</p>
    </footer>
  );
};
