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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ApprovalStatus } from "../../backend";
import { useActor } from "../../hooks/useActor";

export default function AdminAuditLogsPage() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: approvals, isLoading } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });

  async function handleApproval(
    principal: { toString(): string },
    status: ApprovalStatus,
  ) {
    if (!actor) return;
    try {
      await actor.setApproval(principal as never, status);
      toast.success(
        `User ${status === ApprovalStatus.approved ? "approved" : "rejected"}`,
      );
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    } catch {
      toast.error("Action failed. Please try again.");
    }
  }

  const pending =
    approvals?.filter((a) => a.status === ApprovalStatus.pending) ?? [];
  const resolved =
    approvals?.filter((a) => a.status !== ApprovalStatus.pending) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">
          Manage user access and approval queue
        </p>
      </div>

      {/* Pending approvals */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-500" />
            Pending Approvals
            {pending.length > 0 && (
              <Badge className="bg-amber-100 text-amber-700 text-xs">
                {pending.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2" data-ocid="admin.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-6" data-ocid="admin.empty_state">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No pending approvals. All caught up!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((a, i) => (
                  <TableRow
                    key={a.principal.toString()}
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs">
                      {a.principal.toString().slice(0, 12)}…
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          onClick={() =>
                            handleApproval(a.principal, ApprovalStatus.approved)
                          }
                          data-ocid={`admin.confirm_button.${i + 1}`}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-50"
                          onClick={() =>
                            handleApproval(a.principal, ApprovalStatus.rejected)
                          }
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resolved */}
      {resolved.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal</TableHead>
                    <TableHead>Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolved.map((a, i) => (
                    <TableRow
                      key={a.principal.toString()}
                      data-ocid={`admin.row.${pending.length + i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {a.principal.toString().slice(0, 12)}…
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            a.status === ApprovalStatus.approved
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                          variant="secondary"
                        >
                          {a.status === ApprovalStatus.approved
                            ? "Approved"
                            : "Rejected"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
