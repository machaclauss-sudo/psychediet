import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { UserStatus } from "../../backend";
import {
  useAllUsersWithProfiles,
  useSetUserStatus,
} from "../../hooks/useQueries";

function StatusBadge({ status }: { status: UserStatus }) {
  const variants: Record<UserStatus, string> = {
    [UserStatus.active]: "bg-green-100 text-green-700 border-green-200",
    [UserStatus.restricted]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [UserStatus.suspended]: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}
    >
      {status}
    </span>
  );
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsersWithProfiles();
  const { mutateAsync: setStatus, isPending } = useSetUserStatus();

  const handleStatusChange = async (
    principal: Principal,
    status: UserStatus,
    label: string,
  ) => {
    try {
      await setStatus({ user: principal, status });
      toast.success(`User ${label} successfully`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold mb-1">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {users?.length ?? 0} registered users
        </p>
      </motion.div>

      <Card className="shadow-card" data-ocid="admin.table">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="admin.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <div className="p-8 text-center" data-ocid="admin.empty_state">
              <p className="text-muted-foreground text-sm">
                No users registered yet
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">User ID</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Diet</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row, i) => {
                  const principalStr = row.principal.toString();
                  const displayId =
                    row.profile?.userId ?? `${principalStr.slice(0, 12)}...`;
                  return (
                    <TableRow
                      key={principalStr}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="pl-6">
                        {row.profile?.userId ? (
                          <Link
                            to="/admin/user/$userId"
                            params={{ userId: row.profile.userId }}
                          >
                            <span className="font-mono text-xs text-primary hover:underline">
                              {displayId}
                            </span>
                          </Link>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">
                            {displayId}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm line-clamp-1 max-w-[150px]">
                          {row.profile?.goals || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {row.profile?.dietType || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {row.profile ? String(row.profile.age) : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              handleStatusChange(
                                row.principal,
                                UserStatus.active,
                                "approved",
                              )
                            }
                            disabled={
                              isPending || row.status === UserStatus.active
                            }
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(
                                row.principal,
                                UserStatus.suspended,
                                "suspended",
                              )
                            }
                            disabled={
                              isPending || row.status === UserStatus.suspended
                            }
                            data-ocid={`admin.delete_button.${i + 1}`}
                          >
                            Suspend
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
