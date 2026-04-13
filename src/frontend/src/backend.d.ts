import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface GetFoodEntriesFrom {
    foodNames: Array<string>;
    skip: bigint;
    timeRange: {
        __kind__: "all";
        all: null;
    } | {
        __kind__: "entriesBefore";
        entriesBefore: Timestamp;
    } | {
        __kind__: "entriesAfter";
        entriesAfter: Timestamp;
    } | {
        __kind__: "entriesBetween";
        entriesBetween: [Timestamp, Timestamp];
    };
    fromUser: Principal;
    entriesToGet: bigint;
}
export interface DayAnalysis {
    calories: number;
    omega3: number;
    magnesium: number;
    moodScore: number;
    recommendation: string;
}
export type Timestamp = bigint;
export interface SuperUserStatus {
    userRole: UserRole;
    userStatus: {
        __kind__: "inactive";
        inactive: null;
    } | {
        __kind__: "userStatus";
        userStatus: UserStatus;
    };
}
export interface PersonalizedInsights {
    recommendations: string;
    dayAnalysis: Array<DayAnalysis>;
}
export interface MoodEntry {
    id: string;
    time: Timestamp;
    score: number;
    moodTags: Array<string>;
    notes: string;
}
export interface GetFoodEntriesRequest {
    foodNames: Array<string>;
    skip: bigint;
    timeRange: {
        __kind__: "all";
        all: null;
    } | {
        __kind__: "entriesBefore";
        entriesBefore: Timestamp;
    } | {
        __kind__: "entriesAfter";
        entriesAfter: Timestamp;
    } | {
        __kind__: "entriesBetween";
        entriesBetween: [Timestamp, Timestamp];
    };
    entriesToGet: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface FoodEntry {
    id: string;
    calories: number;
    time: Timestamp;
    omega3: number;
    magnesium: number;
    image?: ExternalBlob;
    foodName: string;
}
export interface AggregateAnalytics {
    activeUsers: bigint;
    totalUsers: bigint;
    nutrientTrends: string;
    averageMoodScore: number;
}
export interface UserSummary {
    status: UserStatus;
    lastActivity?: Timestamp;
    riskFlag: string;
}
export interface GetMoodEntries {
    skip: bigint;
    moodTags: Array<string>;
    timeRange: {
        __kind__: "all";
        all: null;
    } | {
        __kind__: "entriesBefore";
        entriesBefore: Timestamp;
    } | {
        __kind__: "entriesAfter";
        entriesAfter: Timestamp;
    } | {
        __kind__: "entriesBetween";
        entriesBetween: [Timestamp, Timestamp];
    };
    entriesToGet: bigint;
}
export interface UserProfile {
    age: bigint;
    userId: string;
    goals: string;
    gender: string;
    healthConditions: Array<string>;
    dietType: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    active = "active",
    restricted = "restricted",
    suspended = "suspended"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeOnboarding(profile: UserProfile): Promise<void>;
    getAggregateAnalytics(): Promise<AggregateAnalytics>;
    getAllCurrentUserFoodEntriesReverse(): Promise<Array<FoodEntry>>;
    getAllCurrentUserMoodEntries(): Promise<Array<MoodEntry>>;
    getAllCurrentUserMoodEntriesReverse(): Promise<Array<MoodEntry>>;
    getAllFoodEntriesForCurrentUser(): Promise<Array<FoodEntry>>;
    getAllFoodEntriesForCurrentUserByFoodNames(foodNames: Array<string>): Promise<Array<FoodEntry>>;
    getAllFoodEntriesForUser(user: Principal): Promise<Array<FoodEntry>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getAverageMoodScore(): Promise<number>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentUserFoodEntry(id: string): Promise<FoodEntry | null>;
    getCurrentUserMoodEntries(): Promise<Array<MoodEntry>>;
    getCurrentUserMoodEntryIdsByMoodTags(moodTags: Array<string>): Promise<Array<string>>;
    getCurrentUserProfile(): Promise<UserProfile | null>;
    getCurrentUsersWithStatus(): Promise<Array<[Principal, UserStatus]>>;
    getFoodEntries(request: GetFoodEntriesFrom): Promise<Array<FoodEntry>>;
    getFoodEntriesAfterTime(request: {
        afterTime: Timestamp;
    }, principal: Principal): Promise<Array<FoodEntry>>;
    getFoodEntriesAfterTimeForUser(time: Timestamp, user: Principal): Promise<Array<FoodEntry>>;
    getFoodEntriesForCurrentUser(request: GetFoodEntriesRequest): Promise<Array<FoodEntry>>;
    getFoodEntriesIdsWithImageForCurrentUser(): Promise<Array<string>>;
    getFoodEntriesWithImageForCurrentUser(): Promise<Array<FoodEntry>>;
    getFoodEntryById(id: string): Promise<FoodEntry | null>;
    getFoodEntryIdsForCurrentUser(): Promise<Array<string>>;
    getFoodEntryIdsForCurrentUserByFoodNames(foodNames: Array<string>): Promise<Array<string>>;
    getFoodEntryImage(foodEntryId: string): Promise<ExternalBlob>;
    getHighestOmega3FoodEntriesForCurrentUser(): Promise<Array<FoodEntry>>;
    getMoodEntriesForCurrentUser(request: GetMoodEntries): Promise<Array<MoodEntry>>;
    getMoodEntriesForUser(request: GetMoodEntries, user: Principal): Promise<Array<MoodEntry>>;
    getMoodEntriesIdForUser(user: Principal): Promise<Array<string>>;
    getMoodEntriesIdsForCurrentUser(): Promise<Array<string>>;
    getMoodEntriesIdsForUserByMoodTags(user: Principal, moodTags: Array<string>): Promise<Array<string>>;
    getMoodEntryIdsForCurrentUser(): Promise<Array<string>>;
    getPersonalizedInsights(): Promise<PersonalizedInsights>;
    getSuperUserStatus(user: Principal): Promise<SuperUserStatus>;
    getUserMoodEntryWithId(id: string, user: Principal): Promise<MoodEntry>;
    getUserProfile(userId: string): Promise<UserProfile>;
    getUserProfileByPrincipal(user: Principal): Promise<UserProfile>;
    getUserStatus(user: Principal): Promise<UserStatus>;
    getUsersWithStatus(status: UserStatus): Promise<Array<Principal>>;
    getUsersWithStatusSummary(status: UserStatus): Promise<Array<[Principal, UserSummary]>>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    logFoodEntry(foodEntry: FoodEntry): Promise<void>;
    logMoodEntry(moodEntry: MoodEntry): Promise<void>;
    requestApproval(): Promise<void>;
    searchFoodEntries(arg0: {
        foodNames: Array<string>;
    }): Promise<Array<FoodEntry>>;
    searchMoodEntries(arg0: {
        moodTags: Array<string>;
    }): Promise<Array<MoodEntry>>;
    searchUserProfiles(searchText: string): Promise<Array<UserProfile>>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setFoodEntryImage(foodEntryId: string, image: ExternalBlob): Promise<void>;
    setStatusToUserForAdmin(user: Principal, status: UserStatus): Promise<void>;
}
