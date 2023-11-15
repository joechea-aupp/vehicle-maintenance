export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content w-screen">
      <aside>
        <p>Copyright © {currentYear} - All right reserved by Joe CHEA</p>
      </aside>
    </footer>
  );
}
