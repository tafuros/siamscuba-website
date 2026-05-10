import { Link } from "react-router-dom";
import logo from "@/assets/siam-logo.png";

interface LanderNavProps {
  homePath?: string;
}

const LanderNav = ({ homePath = "/" }: LanderNavProps) => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3">
          <Link to={homePath} aria-label="Siam Scuba" className="flex items-center shrink-0">
            <img src={logo} alt="Siam Scuba" className="h-14 md:h-16 w-auto" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LanderNav;
