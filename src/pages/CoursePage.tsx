import { useParams, Navigate } from "react-router-dom";
import { SLUG_TO_COURSE } from "@/lib/courseSlugMap";
import Index from "./Index";

const CoursePage = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const courseName = courseSlug ? SLUG_TO_COURSE[courseSlug] : undefined;

  // If slug doesn't match a known course, let it fall through to NotFound
  if (!courseName) {
    return <Navigate to="/404" replace />;
  }

  return <Index courseOverride={courseName} />;
};

export default CoursePage;
