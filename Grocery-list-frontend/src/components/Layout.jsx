import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0118" }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, padding: "2rem", color: "white" }}>
        {children}
      </main>
    </div>
  );
}