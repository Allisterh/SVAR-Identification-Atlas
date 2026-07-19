function [a, u, Y_hat] = VAR(Y,p)
    [T,n] = size(Y);

    a = NaN(n,1+p*n);
    u = NaN(T,n);
    Y_hat = NaN(T,n);

    rhs = get_rhs(Y,p);
    for i = 1:n
        lhs = Y(:,i);
        [beta_this,stf,u_this,Y_hat_this,ser] = ols(lhs,rhs);
        u(:,i) = u_this;
        Y_hat(:,i) = Y_hat_this;
        a(i,:) = beta_this;
    end
end