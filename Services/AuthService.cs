namespace ProdigioApp.Services
{
    public class AuthService
    {
        public bool IsAuthenticated { get; private set; }

        public bool Login(string username, string password)
        {
            if (username == "admin" && password == "admin123")
            {
                IsAuthenticated = true;
                return true;
            }
            
            return false;
        }

        public void Logout()
        {
            IsAuthenticated = false;
        }
    }
}
