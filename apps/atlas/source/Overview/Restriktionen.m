function [out] = Restriktionen(b,u,phi)

[T,n] = size(u); 
B=eye(n);
B(1,2) = b(1);
B(2,1) = b(2);


e = inv(B) * u';
e=e';

Omega_vec = mean( e(:,1) .* e(:,2) )  ;

psi = get_psi(phi,B);
psiSP = NaN(length(psi(1,2,:)),1);
for t = 1:length(psiSP)
    psiSP(t) = sum(psi(1,2,1:t));
end
Langfristrest = psiSP(end);

out = [Omega_vec;Langfristrest];


end