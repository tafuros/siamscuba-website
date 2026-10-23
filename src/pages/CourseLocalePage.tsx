import { useLocation } from "react-router-dom";
import { isCoursePageSlug } from "@/data/coursePages";
import CourseLandingPage from "./CourseLandingPage";
import NotFound from "./NotFound";

/**
 * /he/<course> and /es/<course> (Ben 2026-10-23: one page per course, in every
 * language). The slug is the last path segment; the language comes from the
 * URL prefix through LanguageContext, so the prerender bakes it in.
 */
const CourseLocalePage = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return isCoursePageSlug(slug) ? <CourseLandingPage slug={slug} /> : <NotFound />;
};

export default CourseLocalePage;
