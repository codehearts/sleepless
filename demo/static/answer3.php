<?php require_once 'framework.php'; ?>
<?php get_header('Swedish | Now Studying | Sleepless Demo', 'question-page'); ?>
	<section id="front" class="card one-sided-card is-muted">
		<div class="card-front">
			<span class="card-field">Vilken färg är din nya datorn?</span>
		</div>
	</section>
	<section id="back" class="fade-in">
		<div class="card one-sided-card">
			<div class="card-back">
				<span class="card-field">What color is your new computer?</span>
			</div>
		</div>
		
		<form method="post" action="completed.php" class="study-levels">
			<input type="submit" name="study-l0" value="Repeat" class="btn bad-btn large-btn" id="study-l0" />
			<input type="submit" name="study-l1" value="Bad" class="btn good-btn large-btn" id="study-l1" />
			<input type="submit" name="study-l2" value="Good" class="btn good-btn large-btn" id="study-l2" />
			<input type="submit" name="study-l3" value="Excellent" class="btn good-btn large-btn" id="study-l3" />
		</form>
		
		<div class="study-status">
			<span class="study-time">2:12</span> 
			<span class="study-progress">8/23</span>
		</div>
	</section>
<?php get_footer('study'); ?>