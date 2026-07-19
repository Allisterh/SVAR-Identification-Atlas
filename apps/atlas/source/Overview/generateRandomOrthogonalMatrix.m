function Q = generateRandomOrthogonalMatrix(n)
    W = randn(n, n);  % Generate n times n matrix W from N(0, I_n) distribution
    [Q, ~] = qr(W);  % Perform QR factorization on W
    % Normalize the diagonal elements of R to be positive
    D = diag(sign(diag(Q)));
    Q = Q * D;
end