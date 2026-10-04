import { useParams, Navigate } from "react-router-dom";
import { SLUG_TO_COURSE } from "@/lib/courseSlugMap";
import { isCoursePageSlug } from "@/data/coursePages";
import CourseLandingPage from "./CourseLandingPage";
import Index from "./Index";

const CoursePage = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  // hasOwnProperty: /constructor would otherwise resolve to Object.prototype's.
  const courseName =
    courseSlug && Object.prototype.hasOwnProperty.call(SLUG_TO_COURSE, courseSlug)
      ? SLUG_TO_COURSE[courseSlug]
      : undefined;

  // If slug doesn't match a known course, let it fall through to NotFound
  if (!courseName) {
    return <Navigate to="/404" replace />;
  }

  // Real course pages (2026-10-04) for the courses that have one; the rest
  // still render the homepage with their course popup open.
  if (courseSlug && isCoursePageSlug(courseSlug)) {
    return <CourseLandingPage slug={courseSlug} />;
  }

  return <Index courseOverride={courseName} />;
};

export default CoursePage;
