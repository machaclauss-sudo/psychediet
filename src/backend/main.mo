import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();

  // Explicitly apply authorization mixin functionality (don't accidentally remove)
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let foodEntries = Map.empty<Principal, Map.Map<Text, FoodEntry>>();
  let moodEntries = Map.empty<Principal, Map.Map<Text, MoodEntry>>();
  let userStatus = Map.empty<Principal, UserStatus>();
  let auditLog = List.empty<AuditLogEntry>();
  let userIdMap = Map.empty<Text, Principal>();

  let approvalState = UserApproval.initState(accessControlState);

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can change user approval status");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view approval list");
    };
    UserApproval.listApprovals(approvalState);
  };

  type Timestamp = Time.Time;

  module Timestamp {
    public func compare(t1 : Timestamp, t2 : Timestamp) : Order.Order {
      Int.compare(t1, t2);
    };
  };

  public type UserStatus = {
    #active;
    #restricted;
    #suspended;
  };

  module UserStatus {
    public func toText(status : UserStatus) : Text {
      switch (status) {
        case (#active) { "active" };
        case (#restricted) { "restricted" };
        case (#suspended) { "suspended" };
      };
    };
  };

  public type SuperUserStatus = {
    userRole : AccessControl.UserRole;
    userStatus : {
      #inactive;
      #userStatus : UserStatus;
    };
  };

  module SuperUserStatus {
    public func toText(status : SuperUserStatus) : Text {
      switch (status.userRole) {
        case (#admin) { "admin" };
        case (#guest) { "guest" };
        case (#user) {
          switch (status.userStatus) {
            case (#inactive) { "inactive" };
            case (#userStatus(userStatus)) { UserStatus.toText(userStatus) };
          };
        };
      };
    };
  };

  public type FoodEntry = {
    id : Text;
    foodName : Text;
    calories : Float;
    magnesium : Float;
    omega3 : Float;
    image : ?Storage.ExternalBlob;
    time : Timestamp;
  };

  module FoodEntry {
    public func compare(f1 : FoodEntry, f2 : FoodEntry) : Order.Order {
      Timestamp.compare(f1.time, f2.time);
    };
  };

  public type MoodEntry = {
    id : Text;
    score : Float;
    notes : Text;
    moodTags : [Text];
    time : Timestamp;
  };

  module MoodEntry {
    public func compare(m1 : MoodEntry, m2 : MoodEntry) : Order.Order {
      Timestamp.compare(m1.time, m2.time);
    };
  };

  public type UserProfile = {
    userId : Text;
    age : Nat;
    gender : Text;
    dietType : Text;
    healthConditions : [Text];
    goals : Text;
  };

  module UserProfile {
    public func compareById(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.userId, p2.userId);
    };
  };

  public type UserSummary = {
    status : UserStatus;
    lastActivity : ?Timestamp;
    riskFlag : Text;
  };

  module UserSummary {
    public func compareByLastActivity(s1 : UserSummary, s2 : UserSummary) : Order.Order {
      switch (s2.lastActivity, s1.lastActivity) {
        case (?t2, ?t1) { Timestamp.compare(t1, t2) };
        case (null, ?_) { #less };
        case (?_, null) { #greater };
        case (null, null) { #equal };
      };
    };
  };

  public type AuditLogEntry = {
    adminId : Principal;
    action : Text;
    timestamp : Timestamp;
  };

  public type AggregateAnalytics = {
    totalUsers : Nat;
    activeUsers : Nat;
    averageMoodScore : Float;
    nutrientTrends : Text;
  };

  public type DayAnalysis = {
    calories : Float;
    magnesium : Float;
    omega3 : Float;
    moodScore : Float;
    recommendation : Text;
  };

  public type PersonalizedInsights = {
    dayAnalysis : [DayAnalysis];
    recommendations : Text;
  };

  public type GetFoodEntriesRequest = {
    foodNames : [Text];
    timeRange : {
      #all;
      #entriesBefore : Timestamp;
      #entriesAfter : Timestamp;
      #entriesBetween : (Timestamp, Timestamp);
    };
    skip : Nat;
    entriesToGet : Nat;
  };

  public type GetFoodEntriesFrom = {
    foodNames : [Text];
    timeRange : {
      #all;
      #entriesBefore : Timestamp;
      #entriesAfter : Timestamp;
      #entriesBetween : (Timestamp, Timestamp);
    };
    skip : Nat;
    entriesToGet : Nat;
    fromUser : Principal;
  };

  public type GetMoodEntries = {
    moodTags : [Text];
    timeRange : {
      #all;
      #entriesBefore : Timestamp;
      #entriesAfter : Timestamp;
      #entriesBetween : (Timestamp, Timestamp);
    };
    skip : Nat;
    entriesToGet : Nat;
  };

  module TextSet {
    public func compare(set1 : Set.Set<Text>, set2 : Set.Set<Text>) : Order.Order {
      if (set1.size() > set2.size()) { return #greater };
      if (set1.size() < set2.size()) { return #less };
      let iter1 = set1.values().toArray().sort().values();
      let iter2 = set2.values().toArray().sort().values();
      #equal;
    };

    public func isSubset(set1 : Set.Set<Text>, set2 : Set.Set<Text>) : Bool {
      set1.values().all(
        func(element) {
          set2.contains(element);
        }
      );
    };

    public func containsAny(set1 : Set.Set<Text>, set2 : Set.Set<Text>) : Bool {
      set1.values().any(
        func(element) {
          set2.contains(element);
        }
      );
    };

    public func fromArray(array : [Text]) : Set.Set<Text> {
      let set = Set.empty<Text>();
      array.values().forEach(
        func(element) {
          set.add(element);
        }
      );
      set;
    };
  };

  public shared ({ caller }) func completeOnboarding(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete onboarding");
    };

    if (userIdMap.containsKey(profile.userId)) {
      Runtime.trap("UserId already exists. Please choose a different userId");
    };

    let existingProfile = userProfiles.get(caller);

    if (existingProfile == null) {
      userProfiles.add(caller, profile);
      userIdMap.add(profile.userId, caller);
      userStatus.add(caller, #active);
    } else {
      userProfiles.add(caller, profile);
    };
  };

  public shared ({ caller }) func logFoodEntry(foodEntry : FoodEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log food entries");
    };

    let entries = switch (foodEntries.get(caller)) {
      case (null) { Map.empty<Text, FoodEntry>() };
      case (?existing) { existing };
    };
    entries.add(foodEntry.id, foodEntry);
    foodEntries.add(caller, entries);
  };

  public shared ({ caller }) func logMoodEntry(moodEntry : MoodEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log mood entries");
    };

    let entries = switch (moodEntries.get(caller)) {
      case (null) { Map.empty<Text, MoodEntry>() };
      case (?existing) { existing };
    };
    entries.add(moodEntry.id, moodEntry);
    moodEntries.add(caller, entries);
  };

  public query ({ caller }) func getFoodEntryIdsForCurrentUser() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.keys().toArray() };
    };
  };

  public query ({ caller }) func getMoodEntryIdsForCurrentUser() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.keys().toArray() };
    };
  };

  public query ({ caller }) func getFoodEntryIdsForCurrentUserByFoodNames(foodNames : [Text]) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    let foodNamesSet = Set.fromArray(foodNames);
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.entries().toArray().filter(
          func((_, food)) {
            foodNamesSet.contains(food.foodName);
          }
        ).map(
          func((id, _)) { id }
        );
      };
    };
  };

  public query ({ caller }) func getCurrentUserFoodEntry(id : Text) : async ?FoodEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { null };
      case (?entries) { entries.get(id) };
    };
  };

  public query ({ caller }) func searchFoodEntries({ foodNames } : { foodNames : [Text] }) : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search their food entries");
    };
    let foodNamesSet = Set.fromArray(foodNames);
    let results = List.empty<FoodEntry>();
    switch (foodEntries.get(caller)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(foodEntry) {
            if (foodNamesSet.contains(foodEntry.foodName)) {
              results.add(foodEntry);
            };
          }
        );
      };
    };

    results.toArray();
  };

  public query ({ caller }) func getAllCurrentUserFoodEntriesReverse() : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().sort();
      };
    };
  };

  public query ({ caller }) func getCurrentUserMoodEntries() : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getFoodEntriesIdsWithImageForCurrentUser() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.entries().toArray().filter(
          func((_, foodEntry)) {
            foodEntry.image != null;
          }
        ).map(func((id, _)) { id });
      };
    };
  };

  public query ({ caller }) func getFoodEntriesWithImageForCurrentUser() : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().filter(
          func(foodEntry) {
            foodEntry.image != null;
          }
        );
      };
    };
  };

  public query ({ caller }) func getFoodEntriesForCurrentUser(request : GetFoodEntriesRequest) : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    let foodNamesSet = Set.fromArray(request.foodNames);

    let filteredEntries = List.empty<FoodEntry>();

    switch (foodEntries.get(caller)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(entry) {
            let foodNameMatch = if (foodNamesSet.isEmpty()) { true } else { foodNamesSet.contains(entry.foodName) };
            if (foodNameMatch) {
              switch (request.timeRange) {
                case (#all) { filteredEntries.add(entry) };
                case (#entriesAfter(time)) {
                  if (entry.time > time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBefore(time)) {
                  if (entry.time < time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBetween(fromTime, toTime)) {
                  if (entry.time >= fromTime and entry.time <= toTime) {
                    filteredEntries.add(entry);
                  };
                };
              };
            };
          }
        );
      };
    };

    let filteredEntriesArray = filteredEntries.toArray().sort();

    let entriesSliceSize = if (request.entriesToGet == 0) {
      filteredEntriesArray.size();
    } else {
      request.entriesToGet;
    };

    filteredEntriesArray.sliceToArray(request.skip, request.skip + entriesSliceSize);
  };

  public query ({ caller }) func getCurrentUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getAllFoodEntriesForCurrentUser() : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getAllFoodEntriesForCurrentUserByFoodNames(foodNames : [Text]) : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    let foodNamesSet = Set.fromArray(foodNames);

    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().filter(
          func(foodEntry) {
            foodNamesSet.contains(foodEntry.foodName);
          }
        );
      };
    };
  };

  public query ({ caller }) func getFoodEntryById(id : Text) : async ?FoodEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    switch (foodEntries.get(caller)) {
      case (null) { null };
      case (?entries) { entries.get(id) };
    };
  };

  public query ({ caller }) func getFoodEntries(request : GetFoodEntriesFrom) : async [FoodEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' food entries");
    };

    let foodNamesSet = Set.fromArray(request.foodNames);

    let foundEntries = List.empty<FoodEntry>();
    switch (foodEntries.get(request.fromUser)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(entry) {
            let foodNameMatch = if (foodNamesSet.isEmpty()) { true } else { foodNamesSet.contains(entry.foodName) };
            if (foodNameMatch) {
              switch (request.timeRange) {
                case (#all) { foundEntries.add(entry) };
                case (#entriesAfter(time)) {
                  if (entry.time > time) {
                    foundEntries.add(entry);
                  };
                };
                case (#entriesBefore(time)) {
                  if (entry.time < time) {
                    foundEntries.add(entry);
                  };
                };
                case (#entriesBetween(fromTime, toTime)) {
                  if (entry.time >= fromTime and entry.time <= toTime) {
                    foundEntries.add(entry);
                  };
                };
              };
            };
          }
        );
      };
    };

    let foundEntriesArray = foundEntries.toArray().sort();

    let entriesSliceSize = if (request.entriesToGet == 0) {
      foundEntriesArray.size();
    } else {
      request.entriesToGet;
    };

    foundEntriesArray.sliceToArray(request.skip, request.skip + entriesSliceSize);
  };

  public query ({ caller }) func getFoodEntriesAfterTime(request : { afterTime : Timestamp }, principal : Principal) : async [FoodEntry] {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own food entries");
    };

    let foodEntriesForUser = foodEntries.get(principal);
    switch (foodEntriesForUser) {
      case (null) { [] };
      case (?entries) {
        let filteredEntries = List.empty<FoodEntry>();
        entries.forEach(
          func(id, foodEntry) {
            if (foodEntry.time > request.afterTime) {
              filteredEntries.add(foodEntry);
            };
          }
        );
        filteredEntries.toArray();
      };
    };
  };

  public query ({ caller }) func getSuperUserStatus(user : Principal) : async SuperUserStatus {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own status or must be admin");
    };

    let role = AccessControl.getUserRole(accessControlState, user);

    switch (role) {
      case (#admin) { { userRole = #admin; userStatus = #userStatus(#active) } };
      case (#user) { switch (userStatus.get(user)) {
        case (null) { { userRole = #user; userStatus = #inactive } };
        case (?status) { { userRole = #user; userStatus = #userStatus(status) } };
      } };
      case (#guest) { { userRole = #guest; userStatus = #inactive } };
    };
  };

  public query ({ caller }) func getUserStatus(user : Principal) : async UserStatus {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own status or must be admin");
    };

    switch (userStatus.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?status) { status };
    };
  };

  public shared ({ caller }) func setFoodEntryImage(foodEntryId : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set food entry images");
    };
    switch (foodEntries.get(caller)) {
      case (null) { Runtime.trap("No food entries found for user") };
      case (?entries) {
        switch (entries.get(foodEntryId)) {
          case (null) { Runtime.trap("Food entry does not exist") };
          case (?existingFoodEntry) {
            let updatedFoodEntry : FoodEntry = {
              existingFoodEntry with
              image = ?image;
            };
            entries.add(foodEntryId, updatedFoodEntry);
          };
        };
      };
    };
  };

  public query ({ caller }) func getFoodEntryImage(foodEntryId : Text) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entry images");
    };
    switch (foodEntries.get(caller)) {
      case (null) { Runtime.trap("No food entries found for user") };
      case (?entries) {
        switch (entries.get(foodEntryId)) {
          case (null) { Runtime.trap("Food entry does not exist") };
          case (?foodEntry) {
            switch (foodEntry.image) {
              case (null) { Runtime.trap("Food entry does not have an image") };
              case (?image) { image };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getUsersWithStatus(status : UserStatus) : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view users by status");
    };

    let filteredUserEntries = userStatus.entries().toArray().filter(func((_, s)) { s == status });
    filteredUserEntries.map(func((user, _)) { user });
  };

  public query ({ caller }) func getUserProfile(userId : Text) : async UserProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' profiles");
    };

    let principal = switch (userIdMap.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    switch (userProfiles.get(principal)) {
      case (null) { Runtime.trap("Could not find userProfile") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getUserProfileByPrincipal(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("UserProfile does not exist") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func setStatusToUserForAdmin(user : Principal, status : UserStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change user status");
    };

    userStatus.add(user, status);

    let auditEntry : AuditLogEntry = {
      adminId = caller;
      action = "Set status of " # user.toText() # " to " # UserStatus.toText(status);
      timestamp = Time.now();
    };

    auditLog.add(auditEntry);
  };

  public query ({ caller }) func getCurrentUsersWithStatus() : async [(Principal, UserStatus)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users with status");
    };

    userStatus.entries().toArray();
  };

  public query ({ caller }) func searchUserProfiles(searchText : Text) : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can search user profiles");
    };

    userProfiles.values().toArray().filter(
      func(profile) {
        profile.userId.contains(#text searchText);
      }
    );
  };

  public query ({ caller }) func getUserMoodEntryWithId(id : Text, user : Principal) : async MoodEntry {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own mood entries or must be admin");
    };

    switch (moodEntries.get(user)) {
      case (null) { Runtime.trap("Mood entries do not exist") };
      case (?userMoodEntries) {
        switch (userMoodEntries.get(id)) {
          case (null) { Runtime.trap("Mood entry does not exist") };
          case (?moodEntry) { moodEntry };
        };
      };
    };
  };

  public shared ({ caller }) func getFoodEntriesAfterTimeForUser(time : Timestamp, user : Principal) : async [FoodEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' food entries");
    };

    switch (foodEntries.get(user)) {
      case (null) { Runtime.trap("Food entries do not exist") };
      case (?userFoodEntries) {
        userFoodEntries.values().toArray().filter(
          func(foodEntry) {
            foodEntry.time > time;
          }
        );
      };
    };
  };

  public query ({ caller }) func getMoodEntriesForCurrentUser(request : GetMoodEntries) : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    let moodTagsSet = TextSet.fromArray(request.moodTags);

    let filteredEntries = List.empty<MoodEntry>();

    switch (moodEntries.get(caller)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(entry) {
            let moodTagMatch = if (moodTagsSet.isEmpty()) { true } else {
              let entryTagsSet = TextSet.fromArray(entry.moodTags);
              TextSet.isSubset(moodTagsSet, entryTagsSet);
            };
            if (moodTagMatch) {
              switch (request.timeRange) {
                case (#all) { filteredEntries.add(entry) };
                case (#entriesAfter(time)) {
                  if (entry.time > time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBefore(time)) {
                  if (entry.time < time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBetween(fromTime, toTime)) {
                  if (entry.time >= fromTime and entry.time <= toTime) {
                    filteredEntries.add(entry);
                  };
                };
              };
            };
          }
        );
      };
    };

    let filteredEntriesArray = filteredEntries.toArray().sort();

    let entriesSliceSize = if (request.entriesToGet == 0) {
      filteredEntriesArray.size();
    } else {
      request.entriesToGet;
    };

    filteredEntriesArray.sliceToArray(request.skip, request.skip + entriesSliceSize);
  };

  public query ({ caller }) func getMoodEntriesForUser(request : GetMoodEntries, user : Principal) : async [MoodEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' mood entries");
    };

    let moodTagsSet = TextSet.fromArray(request.moodTags);

    let filteredEntries = List.empty<MoodEntry>();

    switch (moodEntries.get(user)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(entry) {
            let moodTagMatch = if (moodTagsSet.isEmpty()) { true } else {
              let entryTagsSet = TextSet.fromArray(entry.moodTags);
              TextSet.isSubset(moodTagsSet, entryTagsSet);
            };
            if (moodTagMatch) {
              switch (request.timeRange) {
                case (#all) { filteredEntries.add(entry) };
                case (#entriesAfter(time)) {
                  if (entry.time > time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBefore(time)) {
                  if (entry.time < time) {
                    filteredEntries.add(entry);
                  };
                };
                case (#entriesBetween(fromTime, toTime)) {
                  if (entry.time >= fromTime and entry.time <= toTime) {
                    filteredEntries.add(entry);
                  };
                };
              };
            };
          }
        );
      };
    };

    let filteredEntriesArray = filteredEntries.toArray().sort();

    let entriesSliceSize = if (request.entriesToGet == 0) {
      filteredEntriesArray.size();
    } else {
      request.entriesToGet;
    };

    filteredEntriesArray.sliceToArray(request.skip, request.skip + entriesSliceSize);
  };

  public query ({ caller }) func getMoodEntriesIdsForCurrentUser() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.keys().toArray() };
    };
  };

  public query ({ caller }) func searchMoodEntries({ moodTags } : { moodTags : [Text] }) : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search their mood entries");
    };
    let moodTagsSet = TextSet.fromArray(moodTags);
    let results = List.empty<MoodEntry>();

    switch (moodEntries.get(caller)) {
      case (null) { return [] };
      case (?entries) {
        entries.values().forEach(
          func(moodEntry) {
            let entryTagsSet = TextSet.fromArray(moodEntry.moodTags);
            if (moodTagsSet.isEmpty() or TextSet.isSubset(moodTagsSet, entryTagsSet)) {
              results.add(moodEntry);
            };
          }
        );
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getCurrentUserMoodEntryIdsByMoodTags(moodTags : [Text]) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    let moodTagsSet = TextSet.fromArray(moodTags);

    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.entries().toArray().filter(
          func((_, moodEntry)) {
            let entryTagsSet = TextSet.fromArray(moodEntry.moodTags);
            moodTagsSet.isEmpty() or TextSet.isSubset(moodTagsSet, entryTagsSet);
          }
        ).map(func((id, _)) { id });
      };
    };
  };

  public query ({ caller }) func getAllCurrentUserMoodEntriesReverse() : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().sort();
      };
    };
  };

  public query ({ caller }) func getAllFoodEntriesForUser(user : Principal) : async [FoodEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' food entries");
    };

    switch (foodEntries.get(user)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getUsersWithStatusSummary(status : UserStatus) : async [(Principal, UserSummary)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view user status summaries");
    };

    let filteredEntries = List.empty<(Principal, UserSummary)>();

    let filteredUserEntries = userStatus.entries().toArray().filter(
      func((_, s)) {
        s == status;
      }
    );

    filteredUserEntries.forEach(
      func((principal, _)) {
        let lastActivity = switch (foodEntries.get(principal)) {
          case (null) { null };
          case (?entries) {
            let activityList = List.empty<FoodEntry>();
            entries.values().forEach(
              func(foodEntry) {
                activityList.add(foodEntry);
              }
            );
            let sortedEntries = activityList.toArray().sort();
            if (sortedEntries.size() > 0) { ?sortedEntries[0].time } else { null };
          };
        };

        filteredEntries.add((principal, {
          status;
          lastActivity;
          riskFlag = "Not implemented";
        }));
      }
    );

    filteredEntries.toArray().sort(func(a, b) { UserSummary.compareByLastActivity(a.1, b.1) });
  };

  public query ({ caller }) func getHighestOmega3FoodEntriesForCurrentUser() : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their food entries");
    };
    let omega3Map = Map.empty<Float, FoodEntry>();
    switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().forEach(
          func(foodEntry) {
            omega3Map.add(foodEntry.omega3, foodEntry);
          }
        );
        omega3Map.values().toArray().sliceToArray(0, 10);
      };
    };
  };

  public query ({ caller }) func getAllCurrentUserMoodEntries() : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their mood entries");
    };
    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries.values().toArray() };
    };
  };

  public query ({ caller }) func getAggregateAnalytics() : async AggregateAnalytics {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view aggregate analytics");
    };

    let totalUsers = userStatus.size();

    let activeUsers = userStatus.entries().toArray().filter(
      func((_, status)) {
        status == #active;
      }
    ).size();

    var moodScoreSum : Float = 0.0;
    var totalMoodEntries : Float = 0.0;

    moodEntries.values().toArray().forEach(
      func(entries) {
        entries.values().toArray().forEach(
          func(moodEntry) {
            moodScoreSum += moodEntry.score;
            totalMoodEntries += 1;
          }
        );
      }
    );

    let averageMoodScore = if (totalMoodEntries > 0.0) {
      moodScoreSum / totalMoodEntries;
    } else { 0.0 };

    // Nutrient trends calculation would go here

    {
      totalUsers;
      activeUsers;
      averageMoodScore;
      nutrientTrends = "Nutrient trends calculation not implemented yet";
    };
  };

  public query ({ caller }) func getAverageMoodScore() : async Float {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view average mood score");
    };

    var moodScoreSum : Float = 0.0;
    var totalMoodEntries : Float = 0.0;

    moodEntries.values().toArray().forEach(
      func(entries) {
        entries.values().toArray().forEach(
          func(moodEntry) {
            moodScoreSum += moodEntry.score;
            totalMoodEntries += 1;
          }
        );
      }
    );

    if (totalMoodEntries > 0.0) {
      moodScoreSum / totalMoodEntries;
    } else { 0.0 };
  };

  public query ({ caller }) func getPersonalizedInsights() : async PersonalizedInsights {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their personalized insights");
    };
    // Get food entries for current user
    let foodEntriesArray = switch (foodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().sort();
      };
    };

    // Get mood entries for current user
    let moodEntriesArray = switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray().sort();
      };
    };

    {
      dayAnalysis = [];
      recommendations = "Insights generation not yet implemented";
    };
  };

  public query ({ caller }) func getMoodEntriesIdsForUserByMoodTags(user : Principal, moodTags : [Text]) : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' mood entries");
    };

    let moodTagsSet = TextSet.fromArray(moodTags);
    switch (moodEntries.get(user)) {
      case (null) { [] };
      case (?entries) {
        entries.entries().toArray().filter(
          func((_, moodEntry)) {
            let entryTagsSet = TextSet.fromArray(moodEntry.moodTags);
            TextSet.isSubset(moodTagsSet, entryTagsSet);
          }
        ).map(func((id, _)) { id });
      };
    };
  };

  public query ({ caller }) func getMoodEntriesIdForUser(user : Principal) : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' mood entries");
    };

    switch (moodEntries.get(user)) {
      case (null) { [] };
      case (?entries) { entries.keys().toArray() };
    };
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };

    userProfiles.values().toArray().sort(UserProfile.compareById);
  };
};
