namespace Identity.Domain.Users;

/// <summary>
/// Coarse role bundle for a user. The fine-grained permission catalogue
/// (module.entity.action) is layered on top of these in a later slice of #2.
/// </summary>
public enum UserRole
{
    Owner = 0,
    Admin = 1,
    Manager = 2,
    Cashier = 3,
    Waiter = 4,
    KitchenStaff = 5,
    Accountant = 6,
}
