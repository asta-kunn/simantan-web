import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumb as BreadcrumbShadcn,
} from "@/components/ui/breadcrumb";
import { allRoutes } from "@/router/allRoutes";
import { settingRoutes } from "@/router/settingRoutes";
import { ChevronRightIcon, Slash } from "lucide-react";
import { memo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export const Breadcrumbs = memo(({ icon = "arrow" }) => {
  const location = useLocation();
  const params = useParams();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const Icon = icon === "arrow" ? ChevronRightIcon : Slash;

  const items = [];
  let currentPath = "";

  pathnames.forEach((segment) => {
    const routes = [...allRoutes, ...settingRoutes];
    currentPath += `/${segment}`;
    const route = routes.find((r) => r.path === currentPath);

    if (route) {
      let title = route.title;
      if (route.title === ":subCategory" && params.subCategory) {
        title = params.subCategory
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
      items.push({ path: currentPath, title });
    }
  });

  return (
    <BreadcrumbShadcn className="px-3 py-2 hidden md:flex">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div
            key={item.path}
            className="flex items-center text-sm font-medium"
          >
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <span className="text-black">{item.title}</span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link className="text-primary-normal" to={item.path}>
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <Icon className="size-3 mx-1.5" />}
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbShadcn>
  );
});
